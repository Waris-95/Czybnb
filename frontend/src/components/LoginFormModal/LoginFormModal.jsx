import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState("");
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (credential.length > 3 && password.length > 5) {
      setDisabled(false);
    }
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setErrors();
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  };

  const demoSignIn = () => {
    return dispatch(sessionActions.login({
      credential: "Demo-lition",
      password: "password"
    }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) {
          setErrors(data.message);
        }
      });
  }

  return (
    <div className="log-in-container">
      <div className="log-in">
        <h1 >Log In</h1>
      </div>
      <form className="log-in-form" onSubmit={handleSubmit}>
        <input
          className="username"
          type="text"
          placeholder="Username or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          className="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errors && (<p>{errors}</p>)}
        <div className="submit-log-in">
          <button className="log-in-button" disabled={disabled} type="submit">Log In</button>
        </div>
      </form>
      <div className="demo-user">
        <div className="demo-button">
          <button className="demo-underline" onClick={demoSignIn}>Demo user</button>
        </div>
      </div>
    </div>
  );
}

export default LoginFormModal;