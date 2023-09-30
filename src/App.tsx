import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./DashboardStyle.css";
import DashboardPage from "./scenes/DashboardPage";
import LoginPage from "./scenes/login/LoginPage";
import ForgotPasswordPage from "./scenes/login/ForgotPasswordPage";
import RecoverPassword from "./scenes/login/RecoverPassword";
import CourseFrame from "./scenes/courses/CourseFrame";
import SchedulerConcedii from "./scenes/modul_hr/concedii/SchedularConcedii";
import "./scenes/courses/scorm_lms.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Login/:tokenEmail" element={<LoginPage />} />
        <Route path="/Login/ForgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/RecoverPassword" element={<RecoverPassword />} />
        <Route path="/RecoverPassword/:token" element={<RecoverPassword />} />
        <Route path="/Courses/:code" element={<CourseFrame />} />
        <Route path="/Concedii" element={<SchedulerConcedii />} />
      </Routes>
    </Router>
  );
}

export default App;
