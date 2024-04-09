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
  const loginButton = disabled ? 'login-button-on' : "login-button-off"

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = () => {
    setCredential("demo@user.io");
    setPassword("password");
  }

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      {errors.credential && <p style={{marginTop: "0", fontSize: "15px", color: "red"}}>{errors.credential}</p>}
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
        <button id="demo-login-button" type="submit" onClick={demoLogin}>
          Demo Login
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;