const mongoose = require("mongoose");

const moneyRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING"
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel"
  },
  adminResponse: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
moneyRequestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const moneyRequestModel = mongoose.model("moneyRequestModel", moneyRequestSchema);
module.exports = moneyRequestModel;
