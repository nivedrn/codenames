import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../actions/userAction";
import { generateRandomAvatar } from "../../actions/helperAction";
import { gapi, loadAuth2 } from "gapi-script";

export default function Register() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [pic, setPic] = useState(generateRandomAvatar());

	const [password, setPassword] = useState("");

	const registerHandler = (e) => {
		e.preventDefault();
		dispatch(register(name, email, password, pic));
		setEmail("");
		setPassword("");
		setName("");
		setPic(generateRandomAvatar());
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
				attachSignin(document.getElementById("customBtn"), auth2);
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
				attachSignin(document.getElementById("customBtn"), auth2);
			};
			setAuth2();
		}
		// eslint-disable-next-line
	}, [user]);

	const updateUser = (currentUser) => {
		const gName = currentUser.getBasicProfile().getName();
		const gEmail = currentUser.getBasicProfile().getEmail();
		const googleId = currentUser.getBasicProfile().getId();
		setUser({
			name: gName,
			gemail: gEmail,
			googleId: googleId,
			auth2: gapi.auth2.getAuthInstance(),
		});
		dispatch(register(gName, gEmail, googleId, pic));
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
		<div className="authFormRegister">
			<form onSubmit={registerHandler}>
				<h4>Sign Up</h4>
				<p>
					<input
						type="text"
						name="name"
						value={name}
						placeholder="Name"
						onChange={(e) => setName(e.target.value)}
					/>
				</p>
				<p>
					<input
						type="email"
						name="email"
						value={email}
						placeholder="Enter email"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</p>
				<p>
					<input
						type="password"
						name="password"
						value={password}
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</p>
				<input type="submit" value="Register" />
				{/* <button type="submit" value="Register">Register</button> */}
				<div className="or-class">-or-</div>
				<div className="sign-in-with-class">sign up with</div>

				<div id="customBtn" className="google-logo">
					<img
						src={require("../../assets/images/google-logo.png")}
						alt="google sign-up"
					/>
				</div>
			</form>
		</div>
	);
}
