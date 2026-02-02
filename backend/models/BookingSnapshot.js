const mongoose = require("mongoose");

const BookingSnapshotSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  serviceId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  // ✅ ADD THESE
  scheduledDate: {
    type: Date,
    required: true,
  },
  preferredTime: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.BookingSnapshot ||
  mongoose.model("BookingSnapshot", BookingSnapshotSchema);
