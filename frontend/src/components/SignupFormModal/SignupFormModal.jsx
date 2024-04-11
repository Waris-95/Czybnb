import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const disabled = username.length < 4 || password.length < 6;
  const signUpButton = disabled ? "login-button-on" : "login-button-off";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors((prevErrors) => ({ ...prevErrors, ...data.errors }));
          }
          if (!email.includes("@")) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              email: "Invalid email",
            }));
          }
        });
    } else {
      setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }
  };


  return (
    <div className="signup-modal">
      <h1>Sign Up</h1>
      {errors.confirmPassword && (
        <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>
          {errors.confirmPassword}
        </p>
      )}
      {errors.email && (
        <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>
          {errors.email}
        </p>
      )}
      {errors.username && (
        <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>
          {errors.username}
        </p>
      )}
      {errors.firstName && (
        <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>
          {errors.firstName}
        </p>
      )}
      {errors.lastName && (
        <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>
          {errors.lastName}
        </p>
      )}
      <form className="signup-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
        {errors.password && <p>{errors.password}</p>}
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button id={signUpButton} type="submit" disabled={disabled}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;