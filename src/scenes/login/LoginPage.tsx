import { FormEvent, useEffect, useState } from "react";
import "../../DashboardStyle.css";
import {
  loginAPIRequest,
  loginWithTokenAPIRequest,
} from "../../requests/user.request";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../utils/api.utils";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { tokenEmail } = useParams();

  const handleLoginWithToken = async () => {
    if (!tokenEmail) {
      return;
    }
    const loginTokenData = await loginWithTokenAPIRequest(tokenEmail);

    if (loginTokenData.error) {
      alert(loginTokenData.message);
      return;
    }

    localStorage.setItem("token", loginTokenData.token);

    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${loginTokenData.token}`;

    navigate("/");

    console.log("Login with token success");
  };

  useEffect(() => {
    handleLoginWithToken();

    console.log("Login with token success");
  }, [tokenEmail]);

  //create a function that will change the route to "/Login/ForgotPassword"
  //when the button "Forgot password" is clicked
  const handleForgotPassword = () => {
    navigate("/Login/ForgotPassword");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const loginData = {
      emailOrTelephone: username,
      password: password,
    };
    const responseLogin = await loginAPIRequest(loginData);

    if (responseLogin.error) {
      alert(responseLogin.message);
      return;
    }

    console.log("Login success");
    navigate("/");
  };

  return (
    <>
      <div
        style={{ width: "100vw", height: "100vh" }}
        className="flex column align-items-center justify-center"
        id="login-page"
      >
        <form
          onSubmit={onSubmit}
          style={{ maxWidth: "20rem" }}
          className="flex align-items-center column"
        >
          <h1>Login Page</h1>

          <input
            type="text"
            placeholder="Username or Phone Number"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex">
            <button type="submit" className="button-style-1">
              Login
            </button>
            <button
              type="button"
              className="button-style-2"
              onClick={handleForgotPassword}
            >
              Forgot password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
