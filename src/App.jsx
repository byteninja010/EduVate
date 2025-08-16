  import "./App.css";
  import {Route,Routes} from "react-router-dom";
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
import EnrolledCourseView from "./pages/EnrolledCourseView";
import Catalog from "./pages/Catalog";
import CourseDetails from "./pages/CourseDetails";
import Cart from "./pages/Cart";
  function App() {
    return (
      <Provider store={appStore}>
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home/>}> </Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/verifyOtp" element={<OtpVerify/>}></Route>
        <Route path="/about" element={<About/>}></Route>
        <Route path="/contact" element={<ContactUs/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}>
            <Route path="myProfile" element={<MyProfile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="enrolled-courses" element={<EnrolledCourse/>}/>
            <Route path="instructor" element={<InstructorDashboard />} />
            <Route path="student" element={<StudentDashboard />} />
            <Route path="my-courses" element={<MyCourses />} />
            <Route path="add-course" element={<AddCourse />} />
            <Route path="edit-course/:courseId" element={<EditCourse />} />
            <Route path="manage-course/:courseId" element={<ManageCourse />} />
            <Route path="wallet" element={<Wallet />} />
        </Route>
                          <Route path="/catalog" element={<Catalog/>}></Route>
                  <Route path="/catalog/:catalogName" element={<Catalog/>}></Route>
        <Route path="/course/:courseId" element={<CourseDetails/>}></Route>
        <Route path="/enrolled-course/:courseId" element={<EnrolledCourseView/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
      </Routes>
      {/* <Footer/> */}
    </div>
    </Provider>
    );
  }

  export default App;
