import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const disabled = credential.length < 4 || password.length < 6;
  const loginButton = disabled ? 'login-button-on' : "login-button-off";

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({}); // Clear any previous errors
  
    // Attempt login
    dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        // Close modal on successful login
        closeModal();
      })
      .catch(async (res) => {
        // Handle errors
        if (res instanceof Error && res.message === 'Invalid credentials') {
          // Handle invalid credentials error
          setErrors({ credential: "The provided credentials were invalid" });
        } else {
          // Handle other errors
          console.error("An error occurred during login:", res);
          // You can add additional error handling logic here
        }
      });
  };
  
  
  const demoLogin = () => {
    setCredential("demo@user.io");
    setPassword("password");
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      {errors.credential && <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>{errors?.credential}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button id={loginButton} type="submit" disabled={disabled}>
          Log In
        </button>
        <button id="demo-login-button" type="button" onClick={demoLogin}>
          Demo Login
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
