const express = require("express");
const { auth } = require("../middlewares/auth");
const { getWallet, purchaseCourse, addMoney, getInstructorRevenue, createMoneyRequest, getMoneyRequests } = require("../Controllers/Wallet");

const router = express.Router();

// Get wallet balance and transactions
router.get("/getWallet", auth, getWallet);

// Purchase a course using wallet
router.post("/purchaseCourse", auth, purchaseCourse);

// Add money to wallet (for testing)
router.post("/addMoney", auth, addMoney);

// Get instructor revenue analytics
router.get("/getInstructorRevenue", auth, getInstructorRevenue);

// Money request routes
router.post("/createMoneyRequest", auth, createMoneyRequest);
router.get("/getMoneyRequests", auth, getMoneyRequests);

module.exports = router;
