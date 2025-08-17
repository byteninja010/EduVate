  import "./App.css";
import {Route,Routes} from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Navbar from "./Components/Common/Navbar";
import appStore from "./utils/appStore";
import { Provider } from "react-redux";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerify from "./pages/OtpVerify";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./Components/Core/Dashboard/MyProfile";
import Settings from "./Components/Core/Dashboard/Settings";
import EnrolledCourse from "./Components/Core/Dashboard/EnrolledCourse";
import InstructorDashboard from "./Components/Core/Dashboard/InstructorDashboard";
import StudentDashboard from "./Components/Core/Dashboard/StudentDashboard";
import MyCourses from "./Components/Core/Dashboard/MyCourses";
import AddCourse from "./Components/Core/Dashboard/AddCourse";
import EditCourse from "./Components/Core/Dashboard/EditCourse";
import ManageCourse from "./Components/Core/Dashboard/ManageCourse";
import Wallet from "./Components/Core/Dashboard/Wallet";
import AdminDashboard from "./Components/Core/Dashboard/AdminDashboard";
import EnrolledCourseView from "./pages/EnrolledCourseView";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import Cart from "./pages/Cart";
import BookADemo from "./pages/BookADemo";
import BanCheck from "./Components/Common/BanCheck";
import ProtectedRoute from "./Components/Common/ProtectedRoute";
import EnrolledCourseRoute from "./Components/Common/EnrolledCourseRoute";
import InstructorCourseRoute from "./Components/Common/InstructorCourseRoute";
import Unauthorized from "./pages/Unauthorized";
  function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
      setIsSidebarOpen(false);
    };

    return (
      <Provider store={appStore}>
        <BanCheck>
          <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
            <Navbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
            <Routes>
              {/* Public Routes - No Authentication Required */}
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/signup" element={<Signup/>} />
              <Route path="/verifyOtp" element={<OtpVerify/>} />
              <Route path="/about" element={<About/>} />
              <Route path="/contact" element={<ContactUs/>} />
              <Route path="/catalog" element={<Catalog/>} />
              <Route path="/catalog/:catalogName" element={<Catalog/>} />
              <Route path="/course/:courseId" element={<CourseDetails/>} />
              <Route path="/bookADemo" element={<BookADemo/>} />

              {/* Protected Routes - Authentication Required */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireAuth={true}>
                  <Dashboard isMobileMenuOpen={isSidebarOpen} closeMobileMenu={closeSidebar} />
                </ProtectedRoute>
              }>
                <Route path="myProfile" element={<MyProfile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="enrolled-courses" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Student']}>
                    <EnrolledCourse/>
                  </ProtectedRoute>
                }/>
                <Route path="student" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="wallet" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Student']}>
                    <Wallet />
                  </ProtectedRoute>
                } />
                
                {/* Instructor Only Routes */}
                <Route path="instructor" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Instructor']}>
                    <InstructorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="my-courses" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Instructor']}>
                    <MyCourses />
                  </ProtectedRoute>
                } />
                <Route path="add-course" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Instructor']}>
                    <AddCourse />
                  </ProtectedRoute>
                } />
                <Route path="edit-course/:courseId" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Instructor']}>
                    <InstructorCourseRoute>
                      <EditCourse />
                    </InstructorCourseRoute>
                  </ProtectedRoute>
                } />
                <Route path="manage-course/:courseId" element={
                  <ProtectedRoute requireAuth={true} allowedAccountTypes={['Instructor']}>
                    <InstructorCourseRoute>
                      <ManageCourse />
                    </InstructorCourseRoute>
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Enrolled Course View - Must be enrolled */}
              <Route path="/enrolled-course/:courseId" element={
                <ProtectedRoute requireAuth={true}>
                  <EnrolledCourseRoute>
                    <EnrolledCourseView/>
                  </EnrolledCourseRoute>
                </ProtectedRoute>
              } />
              
              {/* Cart - Students Only */}
              <Route path="/cart" element={
                <ProtectedRoute requireAuth={true} allowedAccountTypes={['Student']}>
                  <Cart/>
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAuth={true} allowedAccountTypes={['Admin']}>
                  <AdminDashboard/>
                </ProtectedRoute>
              } />
              
              {/* Unauthorized Page */}
              <Route path="/unauthorized" element={<Unauthorized/>} />
            </Routes>
            {/* <Footer/> */}
          </div>
        </BanCheck>
      </Provider>
    );
  }

  export default App;
