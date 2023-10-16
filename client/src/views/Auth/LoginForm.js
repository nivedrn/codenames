import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { gapi, loadAuth2 } from "gapi-script";
import { login } from "../../actions/userAction";

const Login = () => {
	const dispatch = useDispatch();
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");

	const loginHandler = (e) => {
		e.preventDefault();
		dispatch(login(email, password));
		setEmail("");
		setPassword("");
	};

	const [user, setUser] = useState(null);

	useEffect(() => {
		const setAuth2 = async () => {
			const auth2 = await loadAuth2(
				gapi,
				"822823867287-29stllhpgqll8bls8kvjok15mgguf8ui.apps.googleusercontent.com",
				""
			);
			if (auth2.isSignedIn.get()) {
				updateUser(auth2.currentUser.get());
			} else {
				attachSignin(document.getElementById("customBtnLogin"), auth2);
			}
		};
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (!user) {
			const setAuth2 = async () => {
				const auth2 = await loadAuth2(
					gapi,
					"822823867287-29stllhpgqll8bls8kvjok15mgguf8ui.apps.googleusercontent.com",
					""
				);
				attachSignin(document.getElementById("customBtnLogin"), auth2);
			};
			setAuth2();
		}
		// eslint-disable-next-line
	}, [user]);

	const updateUser = (currentUser) => {
		const name = currentUser.getBasicProfile().getName();
		const email = currentUser.getBasicProfile().getEmail();
		const googleId = currentUser.getBasicProfile().getId();
		setUser({
			name: name,
			email: email,
			googleId: googleId,
            auth2 : gapi.auth2.getAuthInstance()
		});
        dispatch(login(email, googleId));
		console.log(currentUser.getBasicProfile().getId());
	};

	const attachSignin = (element, auth2) => {
		auth2.attachClickHandler(
			element,
			{},
			(googleUser) => {
				updateUser(googleUser);
			},
			(error) => {
				console.log(JSON.stringify(error));
			}
		);
	};

	return (
		<div className="authFormLogin">
			<form onSubmit={loginHandler}>
				<h4>Login</h4>
				<p>
					<input
						type="text"
						name="email"
						placeholder="Email..."
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</p>
				<p>
					<input
						type="password"
						name="password"
						placeholder="Password..."
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</p>
				<p>
					{/* <button type="submit" value="Login"></button> */}
					<input type="submit" value="Login" />
				</p>
			</form>
			<div className="or-class">-or-</div>
			<div className="sign-in-with-class">sign in with</div>

			<div id="customBtnLogin" className="google-logo">
				<img
					src={require("../../assets/images/google-logo.png")}
					alt="google login"
				/>
			</div>
		</div>
	);
};

export default Login;
