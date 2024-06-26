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
   return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal) 
        // Close modal on successful login
      .catch(async (res) => {
        console.log(res);
        setErrors({credential: res.message})
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