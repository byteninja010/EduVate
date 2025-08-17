   # EduVate - Online Learning Platform

   **EduVate** is a comprehensive full-stack online learning platform designed to help students discover and enroll in a variety of courses, while enabling instructors to create, manage, and sell their courses. Inspired by platforms like Unacademy and Coursera, EduVate provides a complete learning ecosystem.

   > ✅ **Status**: Project is fully completed and functional! Both backend and frontend are production-ready with all core features implemented.

   ---

   ## 🎥 Demo & Screenshots

   ### Homepage
   ![Eduvate-Brave2025-04-2514-35-37-ezgif com-optimize_uhx1bt](https://github.com/user-attachments/assets/8d25d27c-a322-41c8-b502-41d6c2b784cf)

   ### Authentication
   ![ezgif com-crop](https://github.com/user-attachments/assets/6510e0fe-28b1-4930-9b0a-df25d9587017)

   ---

   ## ✨ Key Features

   ### 🎓 Learning Features
   - **Video Lectures**: High-quality video content delivery
   - **Course Enrollment**: Easy course discovery and enrollment system
   - **Progress Tracking**: Comprehensive learning progress monitoring
   - **Course Management**: Structured course content with sections and subsections
   - **Rating & Reviews**: Student feedback and course evaluation system

   ### 👨‍🏫 Instructor Features
   - **Course Creation**: Build and structure courses with sections
   - **Content Management**: Upload and organize course materials
   - **Student Analytics**: Track student progress and engagement
   - **Revenue Management**: Wallet and payment integration

   ### 👤 User Features
   - **User Authentication**: Secure login/signup with OTP verification
   - **Profile Management**: Personal information and preferences
   - **Dashboard**: Personalized learning dashboard
   - **Wallet System**: Complete buy/sell flow with virtual currency for course transactions

   ### 🔐 Admin Features
- **User Management**: Monitor and manage all users
- **Course Approval**: Review and approve instructor courses
- **System Monitoring**: Overall platform administration

### 💰 Wallet & Payment System
- **Virtual Currency**: Platform-specific wallet system for transactions
- **Buy/Sell Flow**: Complete course purchase and enrollment system
- **Transaction Management**: Secure payment processing and refunds
- **Balance Tracking**: Real-time wallet balance and transaction history

   ---

   ## 🛠️ Tech Stack

   ### Frontend
   - **React 18.2.0** - Modern React with hooks
   - **Tailwind CSS 3.2.7** - Utility-first CSS framework
   - **Redux Toolkit 2.5.0** - State management
   - **React Router DOM 7.0.2** - Client-side routing
   - **React Hook Form 7.54.2** - Form handling and validation
   - **Axios 1.7.9** - HTTP client for API calls
   - **React Hot Toast 2.5.1** - Toast notifications
   - **React Icons 5.4.0** - Icon library
   - **React Type Animation 3.2.0** - Typing animations
   - **React OTP Input 3.1.1** - OTP verification
   - **React Progress Bar 5.3.0** - Progress indicators
   - **React Markdown 10.1.0** - Markdown rendering

   ### Backend
   - **Node.js** - JavaScript runtime
   - **Express 4.19.2** - Web application framework
   - **MongoDB 8.6.1** - NoSQL database with Mongoose ODM
   - **JWT 9.0.2** - Authentication tokens
   - **Bcrypt 5.1.1** - Password hashing
   - **Nodemailer 6.9.15** - Email functionality
   - **Cloudinary 2.5.1** - Cloud image/video storage
   - **Razorpay 2.9.5** - Payment gateway integration
   - **Express FileUpload 1.5.1** - File handling
   - **Cookie Parser 1.4.7** - Cookie management
   - **CORS 2.8.5** - Cross-origin resource sharing

   ### Development Tools
   - **Concurrently 9.1.0** - Run multiple commands simultaneously
   - **Nodemon 3.1.9** - Auto-restart server on changes
   - **Dotenv 16.4.7** - Environment variable management

   ---

   ## 📁 Project Structure

   ```
   EduVate/
   ├── src/                          # Frontend source code
   │   ├── Components/               # React components
   │   │   ├── Common/              # Shared components (Navbar, Footer, etc.)
   │   │   ├── Core/                # Core feature components
   │   │   │   ├── AboutUs/         # About page components
   │   │   │   ├── Auth/            # Authentication components
   │   │   │   ├── ContactUs/       # Contact form components
   │   │   │   ├── Courses/         # Course-related components
   │   │   │   └── Dashboard/       # Dashboard components
   │   │   └── HomePage/            # Homepage components
   │   ├── pages/                    # Page components
   │   ├── services/                 # API services and utilities
   │   ├── slices/                   # Redux store slices
   │   ├── utils/                    # Utility functions
   │   └── assets/                   # Images, logos, and media
   ├── Backend/                      # Backend server code
   │   ├── config/                   # Configuration files
   │   │   ├── cloudinary.js        # Cloudinary setup
   │   │   ├── database.js          # MongoDB connection
   │   │   └── razorpay.js          # Razorpay configuration
   │   ├── Controllers/              # Route controllers
   │   ├── Models/                   # MongoDB schemas
   │   ├── Routes/                   # API route definitions
   │   ├── middlewares/              # Custom middleware
   │   ├── utils/                    # Utility functions
   │   └── mailTemplates/            # Email templates
   ├── public/                       # Static assets
   └── package.json                  # Project dependencies and scripts
   ```

   ---

   ## 🚀 Getting Started

   ### Prerequisites

   - **Node.js** (v18.0.0 or higher)
   - **npm** (v9.0.0 or higher)
   - **MongoDB** (local installation or MongoDB Atlas cloud)
   - **Git** (for cloning the repository)

   ### Installation

   1. **Clone the Repository**
      ```bash
      git clone https://github.com/your-username/eduvate.git
      cd eduvate
      ```

   2. **Install Frontend Dependencies**
      ```bash
      npm install
      ```

   3. **Install Backend Dependencies**
      ```bash
      cd Backend
      npm install
      cd ..
      ```

   4. **Environment Setup**
   
   **Backend Environment Variables**
   
   Create a `.env` file in the `Backend/` directory:
   ```env
   # Database Configuration
   MONGO_URI=your_mongodb_connection_string
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=24h
   
   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_app_password
   
   # Cloudinary Configuration
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   
   # Server Configuration
   PORT=4000
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Frontend Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   # API Base URL
   REACT_BASE_URL=http://localhost:4000
   ```

   5. **Database Setup**
      - Ensure MongoDB is running locally or use MongoDB Atlas
      - The application will automatically create necessary collections

   6. **Run the Application**
      
      **Option 1: Run Both Servers Concurrently**
      ```bash
      npm run dev
      ```
      
      **Option 2: Run Separately**
      ```bash
      # Terminal 1 - Frontend
      npm start
      
      # Terminal 2 - Backend
      npm run server
      ```

   7. **Access the Application**
      - Frontend: http://localhost:3000
      - Backend API: http://localhost:4000

   ---

   ## 📚 API Endpoints

   ### Authentication
   - `POST /api/v1/auth/signup` - User registration
   - `POST /api/v1/auth/login` - User login
   - `POST /api/v1/auth/sendotp` - Send OTP for verification
   - `POST /api/v1/auth/verifyotp` - Verify OTP

   ### Profile Management
   - `GET /api/v1/profile/getUserDetails` - Get user profile
   - `PUT /api/v1/profile/updateProfile` - Update user profile
   - `PUT /api/v1/profile/updateDisplayPicture` - Update profile picture

   ### Course Management
   - `POST /api/v1/course/createCourse` - Create new course
   - `GET /api/v1/course/getAllCourses` - Get all courses
   - `GET /api/v1/course/getCourseDetails/:courseId` - Get course details
   - `PUT /api/v1/course/updateCourse` - Update course

   ### Course Progress
   - `POST /api/v1/courseProgress/updateCourseProgress` - Update progress
   - `GET /api/v1/courseProgress/getProgress` - Get course progress

   ### Admin Routes
   - `GET /api/v1/admin/getAllUsers` - Get all users (admin only)
   - `PUT /api/v1/admin/updateUserStatus` - Update user status

   ---

   

   ## 🧪 Testing

   Currently, the project doesn't have automated tests. Testing will be implemented in future updates.

   ---

   ## 🚀 Deployment

   ### Frontend Deployment
   ```bash
   npm run build
   ```
   The build folder can be deployed to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

   ### Backend Deployment
   ```bash
   cd Backend
   npm start
   ```
   The backend can be deployed to:
   - Heroku
   - AWS EC2
   - DigitalOcean
   - Railway

   ---

   ## 🤝 Contributing

   This project is currently not open to public contributions. However, if you're interested in contributing, please contact the project maintainer.

   ---

   ## 📄 License

   This project is currently unlicensed and not open to public contributions.

   ---

   ## 👨‍💻 Author

   **Shantanu Agarwal**

   - **GitHub**: [@shantanu-agarwal](https://github.com/byteninja010)
   - **Email**: [Contact for queries or suggestions]

   ---

   ## 🙏 Acknowledgments

   - **Design Inspiration**: Unacademy, Coursera, Udemy
   - **UI Components**: Built with Tailwind CSS and React
   - **Icons**: React Icons library
   - **Community**: All contributors and supporters

   ---

   ## 📞 Support

   For support, questions, or suggestions:
   - Create an issue on GitHub
   - Contact the project maintainer directly
   - Check the project documentation

   ---

   **Made with ❤️ for the learning community**
