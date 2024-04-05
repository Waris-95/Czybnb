import './LoginForm.css'
import { useState } from 'react'; // Import useState hook from React
import * as sessionActions from '../../store/session'; // Import session-related action creators
import { useDispatch, useSelector } from 'react-redux'; // Import useDispatch and useSelector hooks from react-redux
import { Navigate } from 'react-router-dom'; // Import Navigate component from react-router-dom

function LoginFormPage() {
  const dispatch = useDispatch(); // Get the dispatch function from useDispatch hook
  const sessionUser = useSelector((state) => state.session.user); // Get the session user from the Redux store using useSelector hook
  const [credential, setCredential] = useState(""); // State for username or email input
  const [password, setPassword] = useState(""); // State for password input
  const [errors, setErrors] = useState({}); // State for form errors

  // Redirect to home page if user is already logged in
  if (sessionUser) return <Navigate to="/" replace={true} />;

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrors({}); // Clear previous errors
    return dispatch(sessionActions.login({ credential, password })).catch( // Dispatch login action with credentials
      async (res) => {
        const data = await res.json(); // Parse response JSON
        if (data?.errors) setErrors(data.errors); // Set errors if present in the response data
      }
    );
  };

  return (
    <div className="login-form-container">
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)} // Update credential state on input change
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state on input change
            required
          />
        </label>
        {errors.credential && <p>{errors.credential}</p>} 
        <button type="submit">Log In</button> 
      </form>
    </>
    </div>
  );
}

export default LoginFormPage;
