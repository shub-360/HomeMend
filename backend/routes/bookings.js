const express = require("express");
const BookingSnapshot = require("../models/BookingSnapshot");
const supabase = require("../lib/supabase");

const router = express.Router();

router.post("/confirm", async (req, res) => {
  try {
    const { userId, serviceId, price } = req.body;

    if (!userId || !serviceId || !price) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ Save snapshot in MongoDB
    const snapshot = await BookingSnapshot.create({
      userId,
      serviceId,
      price,
      status: "pending",
    });

    // 2️⃣ Insert order into Supabase
    const { error } = await supabase.from("orders").insert({
      user_id: userId,
      service_type: serviceId,
      price,
      status: "pending",
    });

    if (error) {
      console.error("FULL Supabase error:", JSON.stringify(error, null, 2));
      return res.status(500).json({
        success: false,
        supabaseError: error,
      });
    }


    // 3️⃣ Success response
    res.json({
      success: true,
      message: "Booking confirmed and synced",
      snapshot,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
