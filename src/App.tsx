import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./DashboardStyle.css";
import DashboardPage from "./scenes/DashboardPage";
import LoginPage from "./scenes/login/LoginPage";
import ForgotPasswordPage from "./scenes/login/ForgotPasswordPage";
import RecoverPassword from "./scenes/login/RecoverPassword";
import Courses from "./scenes/courses/Courses";

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
        <Route path="/Courses/:code" element={<Courses />} />
      </Routes>
    </Router>
  );
}

export default App;
