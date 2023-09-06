import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { changePasswordGeneratedApiRequest } from "../../requests/user.request";

function RecoverPassword() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  //get the token from the url
  const { token } = useParams();

  const handleChangePassword = async () => {
    if (!token) {
      navigate("/Login");
      return;
    }
    const responseChangePassword = await changePasswordGeneratedApiRequest(
      token
    );

    if (responseChangePassword.error) {
      return responseChangePassword.error;
    } else {
      setMessage("Password changed and send to the user");
    }
  };

  useEffect(() => {
    if (!token) {
      setMessage("Token is missing");
    } else {
      setMessage("Token is present");
    }
    handleChangePassword();
  }, [token]);

  return (
    <>
      <div>RecoverPassword</div>
      <div>{message}</div>
    </>
  );
}

export default RecoverPassword;
