import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "./src/middleware/authMiddleware.js"; // Ensure correct file extension (.js)

// Load environment variables
dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://agrosearch.onrender.com", // Allow frontend
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Mongoose Schemas and Models
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
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Reference to User
});
const Seller = mongoose.model("Seller", sellerSchema);

app.post("/api/sell", authMiddleware, async (req, res) => {
  const { crop, quantity, price, description } = req.body;
  const user_id = req.user;

  if (!user_id) {
    return res.status(400).json({ message: "User not authenticated!" });
  }

  try {
    const newSale = new Seller({
      crop,
      quantity,
      price,
      description,
      user_id
    });

    await newSale.save();
    res.status(200).json({ message: "Crop added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
});

app.get("/api/buy", authMiddleware, async (req, res) => {
  try {
    const { crop, quantity } = req.query;

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity)) {
      return res
        .status(400)
        .json({ error: "Invalid quantity parameter. Must be a number." });
    }

    // Use a case-insensitive regex for partial matching
    const sellers = await Seller.find({
      crop: { $regex: crop, $options: "i" }, // Case-insensitive search
      quantity: { $gte: parsedQuantity }
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
    const details = await Info.findOne({ name: new RegExp(`^${crop}$`, "i") });
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

app.get("/api/checkAuth", authMiddleware, (req, res) => {
  console.log("User authenticated:", req.user);
  res.status(200).json({ user: req.user });
});

app.post("/api/signup", async (req, res) => {
  try {
    const { name, phone, address, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, phone, address, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ error: "Signup failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    console.log("Received login request:", req.body);

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

    res.cookie("id", user._id,{
      httpOnly: true,
      secure: true,  // Must be true if using HTTPS
      sameSite: "None"
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.post("/api/cart", async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const seller = await Seller.findById(id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    seller.quantity -= quantity;
    await seller.save();
    res.status(200).json({ message: "Crop bought successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error!" });
  }
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
