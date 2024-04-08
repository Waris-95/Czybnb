import { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
	const dispatch = useDispatch();
	const [credential, setCredential] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState("");
	const { closeModal } = useModal();
	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(credential.length <= 3 || password.length <= 5);
	}, [credential, password]);

	const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(""); // Clear any previous errors
    try {
        await dispatch(sessionActions.login({ credential, password }));
        closeModal();
    } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
            setErrors(err.response.data.message);
        } else {
            setErrors("The provided credentials were invalid.");
        }
    }
};



	const demoSignIn = async () => {
		try {
			await dispatch(sessionActions.login({ credential: "Demo-lition", password: "password" }));
			closeModal();
		} catch (err) {
			if (err.response && err.response.data && err.response.data.message) {
				setErrors(err.response.data.message);
			} else {
				setErrors("The provided credentials were invalid.");
			}
		}
	};

	return (
		<div className="log-in-container">
			<div className="log-in">
				<h1>Log In</h1>
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
				{errors && <p className="error-message">{errors}</p>}
				<div className="submit-log-in">
					<button className="log-in-button" disabled={disabled} type="submit">
						Log In
					</button>
				</div>
			</form>
			<div className="demo-user">
				<div className="demo-button">
					<button className="demo-underline" onClick={demoSignIn}>
						Demo user
					</button>
				</div>
			</div>
		</div>
	);
}

export default LoginFormModal;

