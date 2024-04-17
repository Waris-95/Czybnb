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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const user = {
          email,
          username,
          firstName,
          lastName,
          password,
        };
        const response = await dispatch(sessionActions.signup(user));
        if (!response.ok) {
          // const data = await response.json();
          const errorMessage =
            // data.errors?.email || "A user with that email already exists";
          setErrors({ _error: errorMessage });
        } else {
          closeModal();
        }
      } catch (err) {
        console.error("Signup failed:", err);
        setErrors({ _error: "Username must be unique" });
      }
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
      {errors._error && (
        <p style={{ marginTop: "0", fontSize: "15px", color: "red" }}>
          {errors._error}
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
