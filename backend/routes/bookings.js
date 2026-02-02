const express = require("express");
const BookingSnapshot = require("../models/BookingSnapshot");
const supabase = require("../lib/supabase");

const router = express.Router();
router.post("/confirm", async (req, res) => {
   console.log("🔥 /confirm BODY:", req.body);
  try {
    const {
      userId,
      serviceId,
      price,
      scheduledDate,
      preferredTime,
      address,
    } = req.body;

    if (
      !userId ||
      !serviceId ||
      !price ||
      !scheduledDate ||
      !preferredTime ||
      !address
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ FIX: force Date object
    const parsedDate = new Date(scheduledDate);

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date",
      });
    }

    // 1️⃣ MongoDB snapshot
    const snapshot = await BookingSnapshot.create({
      userId,
      serviceId,
      price,
      scheduledDate: parsedDate, // ✅ FIXED
      preferredTime,
      address,
      status: "pending",
    });

    // 2️⃣ Supabase
  const { error } = await supabase.from("orders").insert({
  user_id: userId,
  service_type: serviceId,
  price,
  status: "pending",
  scheduled_date: scheduledDate, // ✅ exists
});


    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, snapshot });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


module.exports = router;