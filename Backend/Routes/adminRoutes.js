const express = require("express");
const { auth } = require("../middlewares/auth");
const {
    getDashboardStats,
    getAllUsers,
    toggleUserBanStatus,
    getUserDetails,
    deleteUser,
    getMoneyRequests,
    approveMoneyRequest,
    rejectMoneyRequest
} = require("../Controllers/Admin");

const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require("../Controllers/Category");

const router = express.Router();

// Admin middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    try {
        // First check if user is authenticated
        await auth(req, res, () => {});
        
        // Then check if user is admin
        if (req.user.accountType !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }
};

// Apply admin authentication to all routes
router.use(adminAuth);

// Dashboard stats
router.get("/dashboard-stats", getDashboardStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.patch("/users/:userId/ban", toggleUserBanStatus);
router.delete("/users/:userId", deleteUser);

// Test route to verify ban functionality
router.get("/test-ban", (req, res) => {
    res.json({
        success: true,
        message: "Admin route accessible - user not banned"
    });
});

// Money request management
router.get("/money-requests", getMoneyRequests);
router.patch("/money-requests/:requestId/approve", approveMoneyRequest);
router.patch("/money-requests/:requestId/reject", rejectMoneyRequest);

// Category management
router.get("/categories", getCategories);
router.post("/categories", createCategory);
router.put("/categories/:categoryId", updateCategory);
router.delete("/categories/:categoryId", deleteCategory);

module.exports = router;
