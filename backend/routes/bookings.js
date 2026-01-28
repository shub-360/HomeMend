const express = require("express");
const BookingSnapshot = require("../models/BookingSnapshot");

console.log("BookingSnapshot type:", typeof BookingSnapshot);

const router = express.Router();



// Confirm booking → save snapshot in Mongo
router.post("/confirm", async (req, res) => {
  try {
    const snapshot = await BookingSnapshot.create(req.body);

    res.json({
      success: true,
      message: "Booking snapshot saved",
      snapshot,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
