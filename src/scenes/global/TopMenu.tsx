import Profile from "../../assets/Ellipse 1.png";
import NotificationsTwoToneIcon from "@mui/icons-material/NotificationsTwoTone";
import { logoutAPIRequest } from "../../requests/user.request";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function TopMenu() {
  const navigate = useNavigate();
  const [menuActive, setMenuActive] = useState(false);

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
      <div>
        <div
          className="flex align-items-center w-auto"
          style={{ marginRight: "2rem" }}
        >
          <NotificationsTwoToneIcon
            fontSize="large"
            id="notification-icon"
            style={{ marginRight: "1rem" }}
          />

          {/* <div className="user-container flex column w-maxcontent">
            <h5 className="user-name">Alex Nedelcu</h5>
            <h6 className="user-role">Admin</h6>
          </div> */}
          <img src={Profile} alt="profile" width="50" height="50" />
          <svg
            className={`menu-icon ${menuActive ? "active" : ""}`}
            onClick={() => setMenuActive(!menuActive)}
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

        <div className={`top-bar-menu ${menuActive ? "active" : ""}`}>
          <li className="top-bar-menu-item">Home</li>
          <li className="top-bar-menu-item">About</li>
          <li className="top-bar-menu-item">
            <button className="button-logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </div>
      </div>
    </div>
  );
}

export default TopMenu;
