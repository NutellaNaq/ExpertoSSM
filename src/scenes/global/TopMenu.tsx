import Profile from "../../assets/Ellipse 1.png";
import NotificationsSharpIcon from "@mui/icons-material/NotificationsSharp";
import { logoutAPIRequest } from "../../requests/user.request";
import { useNavigate } from "react-router-dom";

function TopMenu() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const responseLogout = await logoutAPIRequest();

    if (responseLogout.error) {
      alert(responseLogout.message);
      return;
    }

    console.log("Logout success");
    navigate("/Login");
  };

  return (
    <div id="top-bar" className="flex w-auto">
      <h1>Dashboard</h1>
      <div className="flex align-items-center w-auto">
        <button className="button-logout" onClick={handleLogout}>
          Logout
        </button>
        <NotificationsSharpIcon fontSize="large" id="notification-icon" />

        <div className="user-container flex column w-maxcontent">
          <h5 className="user-name">Alex Nedelcu</h5>
          <h6 className="user-role">Admin</h6>
        </div>
        <img src={Profile} alt="profile" width="50" height="50" />
        <svg
          style={{ padding: "0 0 0 0.3rem" }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.175 7.1582L10 10.9749L13.825 7.1582L15 8.3332L10 13.3332L5 8.3332L6.175 7.1582Z"
            fill="#272D37"
          />
        </svg>
      </div>
    </div>
  );
}

export default TopMenu;
