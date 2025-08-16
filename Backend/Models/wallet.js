const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["CREDIT", "DEBIT"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseModel"
  },
  courseName: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 10000, // Initial balance of ₹10,000
    min: 0
  },
  transactions: [transactionSchema],
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
walletSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const walletModel = mongoose.model("walletModel", walletSchema);
module.exports = walletModel;
