import { FormEvent, useState } from "react";
import "../DashboardStyle.css";
import { loginAPIRequest } from "../requests/user.request";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const loginData = {
      email: username,
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
            <button type="button" className="button-style-2">
              Forgot password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default LoginPage;
