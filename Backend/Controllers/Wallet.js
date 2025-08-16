const walletModel = require("../Models/wallet");
const userModel = require("../Models/users");
const courseModel = require("../Models/courses");

// Get wallet balance and transactions
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let wallet = await walletModel.findOne({ userId }).populate('transactions.courseId');
    
    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = await walletModel.create({
        userId,
        balance: 10000,
        transactions: []
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Wallet fetched successfully",
      data: wallet
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wallet"
    });
  }
};

// Purchase a course using wallet
exports.purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required"
      });
    }
    
    // Get course details
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }
    
    // Check if user is already enrolled
    const user = await userModel.findById(userId);
    if (user.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course"
      });
    }
    
    // Get or create wallet
    let wallet = await walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await walletModel.create({
        userId,
        balance: 10000,
        transactions: []
      });
    }
    
    // Check if user has sufficient balance
    if (wallet.balance < course.price) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance in wallet",
        required: course.price,
        available: wallet.balance
      });
    }
    
    // Deduct money from wallet
    wallet.balance -= course.price;
    
    // Add transaction record
    wallet.transactions.push({
      type: "DEBIT",
      amount: course.price,
      description: `Purchased course: ${course.courseName}`,
      courseId: courseId,
      courseName: course.courseName
    });
    
    await wallet.save();
    
    // Enroll user in course
    user.courses.push(courseId);
    await user.save();
    
    // Add student to course
    course.studentsEnrolled.push(userId);
    await course.save();
    
    res.status(200).json({
      success: true,
      message: "Course purchased successfully",
      data: {
        courseId: courseId,
        courseName: course.courseName,
        price: course.price,
        remainingBalance: wallet.balance
      }
    });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({
      success: false,
      message: "Failed to purchase course"
    });
  }
};

// Add money to wallet (for testing purposes)
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required"
      });
    }
    
    let wallet = await walletModel.findOne({ userId });
    if (!wallet) {
      wallet = await walletModel.create({
        userId,
        balance: 10000,
        transactions: []
      });
    }
    
    wallet.balance += amount;
    wallet.transactions.push({
      type: "CREDIT",
      amount: amount,
      description: "Added money to wallet",
      timestamp: new Date()
    });
    
    await wallet.save();
    
    res.status(200).json({
      success: true,
      message: "Money added successfully",
      data: {
        newBalance: wallet.balance,
        addedAmount: amount
      }
    });
  } catch (error) {
    console.error("Error adding money:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add money"
    });
  }
};

// Get instructor revenue analytics
exports.getInstructorRevenue = async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    // Get all courses by this instructor
    const courses = await courseModel.find({ instructor: instructorId });
    
    let totalRevenue = 0;
    let totalStudents = 0;
    const courseAnalytics = [];
    
    for (const course of courses) {
      const courseRevenue = course.price * course.studentsEnrolled.length;
      totalRevenue += courseRevenue;
      totalStudents += course.studentsEnrolled.length;
      
      courseAnalytics.push({
        courseId: course._id,
        courseName: course.courseName,
        price: course.price,
        studentsEnrolled: course.studentsEnrolled.length,
        revenue: courseRevenue
      });
    }
    
    res.status(200).json({
      success: true,
      message: "Revenue analytics fetched successfully",
      data: {
        totalRevenue,
        totalStudents,
        totalCourses: courses.length,
        courseAnalytics
      }
    });
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue analytics"
    });
  }
};
