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
  import Catalog from "./pages/Catalog";
  import CourseDetails from "./pages/CourseDetails";
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
        </Route>
        <Route path="/catalog/:catalogName" element={<Catalog/>}></Route>
        <Route path="/course/:courseId" element={<CourseDetails/>}></Route>
      </Routes>
      {/* <Footer/> */}
    </div>
    </Provider>
    );
  }

  export default App;
