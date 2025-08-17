const userModel = require("../Models/users");
const courseModel = require("../Models/courses");
const moneyRequestModel = require("../Models/moneyRequest");
const walletModel = require("../Models/wallet");

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await userModel.countDocuments();
        
        // Get students count
        const students = await userModel.countDocuments({ accountType: "Student" });
        
        // Get instructors count
        const instructors = await userModel.countDocuments({ accountType: "Instructor" });
        
        // Get total courses count
        const totalCourses = await courseModel.countDocuments();
        
        // Calculate total revenue (this would need to be implemented based on your payment system)
        // For now, using a placeholder
        const totalRevenue = 0; // TODO: Implement actual revenue calculation
        
        const stats = {
            totalUsers,
            students,
            instructors,
            totalCourses,
            totalRevenue
        };
        
        return res.status(200).json({
            success: true,
            data: stats,
            message: "Dashboard stats fetched successfully"
        });
    } catch (error) {
        console.log("Error fetching dashboard stats:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching dashboard stats"
        });
    }
};

// Get all users with pagination and filtering
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", accountType = "", status = "" } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (accountType && accountType !== "all") {
            filter.accountType = accountType;
        }
        
        if (status && status !== "all") {
            filter.isBanned = status === "banned";
        }
        
        // Calculate skip value for pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        // Get users with pagination
        const users = await userModel
            .find(filter)
            .select('-password -token -resetPasswordExpires')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
        
        // Get total count for pagination
        const totalUsers = await userModel.countDocuments(filter);
        
        const response = {
            users,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalUsers / parseInt(limit)),
                totalUsers,
                hasNext: skip + users.length < totalUsers,
                hasPrev: parseInt(page) > 1
            }
        };
        
        return res.status(200).json({
            success: true,
            data: response,
            message: "Users fetched successfully"
        });
    } catch (error) {
        console.log("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching users"
        });
    }
};

// Ban/Unban user
exports.toggleUserBanStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBanned } = req.body;
        
        if (typeof isBanned !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "isBanned must be a boolean value"
            });
        }
        
        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Prevent admin from banning themselves
        if (user.accountType === "Admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot ban admin users"
            });
        }
        
        // Update user ban status
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { isBanned },
            { new: true }
        ).select('-password -token -resetPasswordExpires');
        
        const action = isBanned ? "banned" : "unbanned";
        
        return res.status(200).json({
            success: true,
            data: updatedUser,
            message: `User ${action} successfully`
        });
    } catch (error) {
        console.log("Error updating user ban status:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating user ban status"
        });
    }
};

// Get user details
exports.getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await userModel.findById(userId)
            .select('-password -token -resetPasswordExpires')
            .populate('additionalDetails');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            data: user,
            message: "User details fetched successfully"
        });
    } catch (error) {
        console.log("Error fetching user details:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user details"
        });
    }
};

// Delete user (permanent removal)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        // Prevent admin from deleting themselves
        if (user.accountType === "Admin") {
            return res.status(403).json({
                success: false,
                message: "Cannot delete admin users"
            });
        }
        
        // Delete user
        await userModel.findByIdAndDelete(userId);
        
        return res.status(200).json({
            success: true,
            data: {},
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting user"
        });
    }
};

// Get all money requests
exports.getMoneyRequests = async (req, res) => {
    try {
        const moneyRequests = await moneyRequestModel.find()
            .populate('userId', 'firstName lastName email accountType')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            message: "Money requests fetched successfully",
            data: moneyRequests
        });
    } catch (error) {
        console.error("Error fetching money requests:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch money requests"
        });
    }
};

// Approve money request
exports.approveMoneyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { adminResponse } = req.body;
        
        const moneyRequest = await moneyRequestModel.findById(requestId);
        if (!moneyRequest) {
            return res.status(404).json({
                success: false,
                message: "Money request not found"
            });
        }
        
        if (moneyRequest.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Request is not pending"
            });
        }
        
        // Update request status
        moneyRequest.status = "APPROVED";
        moneyRequest.adminId = req.user.id;
        moneyRequest.adminResponse = adminResponse || "Request approved";
        await moneyRequest.save();
        
        // Add money to user's wallet
        let wallet = await walletModel.findOne({ userId: moneyRequest.userId });
        if (!wallet) {
            wallet = await walletModel.create({
                userId: moneyRequest.userId,
                balance: 0,
                transactions: []
            });
        }
        
        wallet.balance += moneyRequest.amount;
        wallet.transactions.push({
            type: "CREDIT",
            amount: moneyRequest.amount,
            description: `Money request approved: ${moneyRequest.reason}`,
            timestamp: new Date()
        });
        
        await wallet.save();
        
        res.status(200).json({
            success: true,
            message: "Money request approved successfully",
            data: {
                requestId: moneyRequest._id,
                amount: moneyRequest.amount,
                newBalance: wallet.balance
            }
        });
    } catch (error) {
        console.error("Error approving money request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to approve money request"
        });
    }
};

// Reject money request
exports.rejectMoneyRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { adminResponse } = req.body;
        
        const moneyRequest = await moneyRequestModel.findById(requestId);
        if (!moneyRequest) {
            return res.status(400).json({
                success: false,
                message: "Money request not found"
            });
        }
        
        if (moneyRequest.status !== "PENDING") {
            return res.status(400).json({
                message: "Request is not pending"
            });
        }
        
        // Update request status
        moneyRequest.status = "REJECTED";
        moneyRequest.adminId = req.user.id;
        moneyRequest.adminResponse = adminResponse || "Request rejected";
        await moneyRequest.save();
        
        res.status(200).json({
            success: true,
            message: "Money request rejected successfully",
            data: {
                requestId: moneyRequest._id,
                amount: moneyRequest.amount
            }
        });
    } catch (error) {
        console.error("Error rejecting money request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reject money request"
        });
    }
};


