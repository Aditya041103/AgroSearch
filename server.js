import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import bodyParser from "body-parser";
import {v2 as cloudinary} from "cloudinary";
import multer from "multer";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors({
  origin: "https://agrosearch.onrender.com",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const infoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: {
    scientific_name: { type: String, required: true },
    category: { type: String, required: true },
    local_names: { type: [String], required: true }
  },
  growingCondition: {
    soil: { type: String, required: true },
    temperature: { type: String, required: true },
    rainfall: { type: String, required: true },
    season: { type: String, required: true }
  }
});

const Info = mongoose.model("Info", infoSchema);

const SchemeSchema = new mongoose.Schema({
  name: String,
  description: String,
  link: String,
  language: Object
});

const Scheme = mongoose.model("Scheme", SchemeSchema);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  phone: String,
  address: String
});

const User = mongoose.model("User", userSchema);

const sellerSchema = new mongoose.Schema({
  crop: String,
  quantity: Number,
  price: Number,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  images: [String],
});
const Seller = mongoose.model("Seller", sellerSchema);

const historySchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  crop: String,
  quantity: Number,
  amount: Number,
})
const History = mongoose.model("History", historySchema);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 10, 
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order:order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const upload=multer({dest:"temp/"})

app.post("/api/sell",upload.array('images',5), async (req, res) => {
  const { crop, quantity, price}= req.body;
  const user_id = req.cookies.user_id;
  const imageURLS=[]
  try {
    for (const file of req.files){
    const result=await cloudinary.uploader.upload(file.path)
    imageURLS.push(result.secure_url)
    fs.unlinkSync(file.path)
  } 
  const newSale = new Seller({
    crop,
    quantity,
    price,
    images: imageURLS,
    user_id
  });
  await newSale.save();
  res.status(200).json({ message: "Crop added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

app.get("/api/buy", async (req, res) => {
  try {
    const { crop, quantity } = req.query;
    const sellers = await Seller.find({
      crop: { $regex: crop, $options: "i" }, // Case-insensitive search
      quantity: { $gte: quantity }
    }).populate("user_id", "name phone address");
    res.status(200).json(sellers);
  } catch (error) {
    console.error("Error fetching sellers:", error);
    res.status(500).json({ error: "Database Fetching Failed" });
  }
});

app.get("/api/details", async (req, res) => {
  try {
    const { crop } = req.query;
    if (!crop) {
      return res.status(400).json({ error: "Crop name is required" });
    }
    const details = await Info.findOne({ name: crop});
    if (!details) {
      return res.status(404).json({ error: "Crop not found" });
    }
    res.status(200).json(details);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database Fetching Failed" });
  }
});

app.get("/api/schemes", async (req, res) => {
  try {
    const schemes = await Scheme.find();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/api/checkAuth", (req, res) => {
  if (req.cookies.name) {
    return res.status(200).json({ message: "User authenticated" })
  };
  return res.status(401).json({ message: "User not authenticated" });
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User already exists" })
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ name, phone, address, email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.cookie('user_id',user.id)
    res.cookie("name", user.name);
    res.cookie("email", user.email);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/api/complete-order", async (req, res) => {
  try {
    console.log(req.body);
    const { seller_id, quantity,crop,amount } = req.body;
    const buyer_id = req.cookies.user_id;
    const seller = await Seller.findById(seller_id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    seller.quantity -= quantity;
    await seller.save();

    const newHistoryEntry = new History({
      seller_id: seller_id,
      buyer_id: buyer_id,
      crop: crop,
      quantity: quantity,
      amount: amount
    })
    await newHistoryEntry.save();

    res.status(200).json({ message: "Crop bought successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error!",err});
  }
});
app.get("/api/history",async(req,res)=>{
  try{
    const user_id=req.cookies.user_id;
    const history =await History.find({ buyer_id: user_id })
    return res.status(200).json(history);
  }catch(err){
    console.error("Error fetching history:", err);
    return res.status(500).json({ message: "Internal server error!" });
  }
})
app.get("/api/profile", async (req, res) => {
  try {
    const user_id = req.cookies.user_id;
    if (!user_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/api/update-profile", async (req, res) => {
  try {
    const user_id = req.cookies.user_id;
    const { name, email, phone, address } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.address = address;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});
app.post("/api/logout", (req, res) => {
  console.log("Logout request received");
  res.clearCookie("user_id");
  res.clearCookie("name");
  res.clearCookie("email");
  res.status(200).json({ message: "Logout successful" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
