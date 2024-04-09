import { useState, useEffect } from "react";
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
  const [disabled, setDisabled] = useState(true);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if(email.length
      && username.length > 3
      && firstName.length
      && lastName.length
      && password.length > 5
      && password === confirmPassword){
     setDisabled(false);
    }
  }, [ email,
    username,
    firstName,
    lastName,
    password,
    confirmPassword]);

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
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className="sign-up-container">
      <h1>Sign Up</h1>
      <form className="sign-up-form-box"onSubmit={handleSubmit}>
        <label>
          Email
          <input
          className="sign-up-input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="p">{errors.email}</p>}
        <label>
          Username
          <input
          className="sign-up-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="p">{errors.username}</p>}
        <label>
          First Name
          <input
          className="sign-up-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        {errors.firstName && <p className="p">{errors.firstName}</p>}
        <label>
          Last Name
          <input
          className="sign-up-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        {errors.lastName && <p className="p">{errors.lastName}</p>}
        <label>
          Password
          <input
          className="sign-up-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="p">{errors.password}</p>}
        <label>
          Confirm Password
          <input
          className="sign-up-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && (
          <p className="p">{errors.confirmPassword}</p>
        )}
        <button className="sign-up-but" disabled={disabled} type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;