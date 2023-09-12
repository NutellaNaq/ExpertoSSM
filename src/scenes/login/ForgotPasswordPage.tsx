import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { recoverPasswordApiRequest } from "../../requests/user.request";

function ForgotPasswordPage() {
  const [emailOrTelephone, setEmailOrTelephone] = useState("");
  // const navigate = useNavigate();

  const handleRecoverApiRequest = async () => {
    const recoverData = await recoverPasswordApiRequest(emailOrTelephone);

    if (recoverData.error) {
      alert(recoverData.message);
      return;
    }

    console.log("Forgot password success");

    console.log(recoverData);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Forgot password success");
    // navigate("/Login");
    handleRecoverApiRequest();
  };

  return (
    <>
      <div
        style={{ width: "100vw", height: "100vh" }}
        className="flex column align-items-center justify-center"
        id="login-page"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h1>Forgot Password Page</h1>
          <form onSubmit={onSubmit} className="flex align-items-center column">
            <input
              type="text"
              placeholder="Username or Phone Number"
              onChange={(e) => setEmailOrTelephone(e.target.value)}
            />

            <button type="submit" className="button-style-1">
              Recover Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
