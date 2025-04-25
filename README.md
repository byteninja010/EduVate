# Eduvate

**Eduvate** is a full-stack online learning platform designed to help students discover and enroll in a variety of courses, while also enabling instructors to sell their courses — inspired by platforms like Unacademy and Coursera.

> 🚧 Eduvate is currently under active development. Backend is ~80% complete, and the student-facing frontend is nearly done.

---


## 🎥 Sneak Peek


![Eduvate-Brave2025-04-2514-35-37-ezgif com-optimize_uhx1bt](https://github.com/user-attachments/assets/8d25d27c-a322-41c8-b502-41d6c2b784cf)

## Login/Logout 
![ezgif com-crop](https://github.com/user-attachments/assets/6510e0fe-28b1-4930-9b0a-df25d9587017)


## ✨ Features

- 🎥 Video Lectures
- 📚 Course Enrollment
- 📊 Progress Tracking
- 💡 Clean and Responsive UI
- 🌐 Full Stack Project (MERN Stack)

---


## 💪 Tech Stack

### Frontend
- React
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- React Hook Form
- Axios
- React Hot Toast
- React Icons
- Type Animation
- OTP Input
- Progress Bar

### Backend
- Node.js
- Express
- MongoDB
- Dotenv

### Tools & Utilities
- Concurrently (to run client and server)
- Razorpay (to be integrated for payment)
- React Scripts (CRA)

---

## 📁 Project Structure

```bash
eduvate/
│
├── Frontend/           # React + Tailwind frontend
├── Backend/            # Node.js + Express + MongoDB backend
└── package.json        # Combined start scripts using concurrently
```

---

## ⚙️ Setup & Running the Project Locally

### Prerequisites

- Node.js (v18+)
- npm (v9+)
- MongoDB (local or cloud, like MongoDB Atlas)

### Getting Started

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/eduvate.git
   cd eduvate
   ```

2. **Install Frontend & Backend Dependencies**
   ```bash
   npm install         # Installs frontend dependencies
   cd Backend
   npm install         # Installs backend dependencies
   ```

3. **Setup Environment Variables**
   - Create a `.env` file inside `Backend/`
   - Add required MongoDB and JWT configs (e.g., `MONGO_URI`, `JWT_SECRET`, etc.)

4. **Run Both Servers Concurrently**
   ```bash
   npm run dev
   ```

---

## 🚀 Deployment

Deployment is not yet done. This section will be updated when the project is deployed.

---

## 🎯 Upcoming Features

- Instructor dashboard
- Admin panel
- Razorpay payment integration
- Embedded video preview (YouTube/Cloud storage)

---


---

## 📄 License

This project is unlicensed as of now and not open to public contributions.

---

## 👌 Acknowledgements

Created with ❤️ by **Shantanu Agarwal**  
For queries or suggestions, feel free to connect!
