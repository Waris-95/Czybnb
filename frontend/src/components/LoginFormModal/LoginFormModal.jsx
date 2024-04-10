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
      .then((res) => {
        if (!res.ok) {
          // If response is not ok, handle error
          throw new Error('Invalid credentials');
        }
        return res.json(); // Convert response to JSON
      })
      .then((data) => {
        // Handle successful login
        if (data && data.user) {
          closeModal(); // Close modal if user object is present
        } else {
          // If response does not contain user object, treat as error
          throw new Error('Invalid credentials');
        }
      })
      .catch((error) => {
        // Handle errors, including invalid credentials
        console.error("An error occurred during login:", error);
        setErrors({ credential: "The provided credentials were invalid" });
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
