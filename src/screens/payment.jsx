import { useEffect } from "react";

const PaymentComponent = ({ amount }) => {
  useEffect(() => {
    const loadRazorpay = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    const response = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency: "INR" }),
    });

    const { order } = await response.json();

    const options = {
      key: "rzp_live_yGYfFddFxJR1UQ",
      amount: order.amount,
      currency: order.currency,
      name: "AgroSearch",
      description: "Payment for Order",
      order_id: order.id,
      handler: (response) => {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay ₹{amount}</button>;
};

export default PaymentComponent;
