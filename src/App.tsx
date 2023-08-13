import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./DashboardStyle.css";
import DashboardPage from "./scenes/DashboardPage";
import LoginPage from "./scenes/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/Login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
