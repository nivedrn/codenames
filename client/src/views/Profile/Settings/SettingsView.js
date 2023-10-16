import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Avatar, { genConfig } from "react-nice-avatar";
import { updateProfile } from "../../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { generateRandomAvatar } from "../../../actions/helperAction";

const SettingsView = (props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userState = useSelector((state) => state.userLogin);
	let [config, setConfig] = useState("");
	let [name, setUsername] = useState("");
	let [email, setEmail] = useState("");
	let [password, setNewPassword] = useState("");
	let [pic, setPic] = useState(generateRandomAvatar());

	useEffect(() => {
		if (userState.userInfo !== null) {
			if ("pic" in userState.userInfo) {
				setConfig(genConfig(userState.userInfo.pic));
				setPic(userState.userInfo.pic);
			}
			if ("email" in userState.userInfo) {
				setEmail(userState.userInfo.email);
			}
			if ("name" in userState.userInfo) {
				setUsername(userState.userInfo.name);
			}
		} else {
			navigate("/");
		}

		// eslint-disable-next-line
	}, [userState]);

	function handleChange(e) {
        e.preventDefault();
		if (e.target.id === "updateUserInfo") {
			if (e.target.value.length >= 0) {
				dispatch(updateProfile({ name, email, pic, password }));
			}
		} else if (e.target.id === "updateUserAvatar") {
			let avatar = generateRandomAvatar();
			setPic(avatar);
			setConfig(genConfig(avatar));
		}
	}

	return (
		<div className="profileSettingsTab">
			<h1>Edit User Details</h1>
			<form className="playerSettingsForm">
				<span
					className="playerAvatarSettings"
					style={{
						backgroundColor: config.bgColor,
						borderRadius: "5px",
					}}
				>
					<Avatar
						shape="rounded"
						className="playerAvatarSettingsElement"
						{...config}
					/>
				</span>
				<span>
					<button
						id="updateUserAvatar"
						className="settingsActionButton"
						onClick={handleChange}
						type="submit"
					>
						Change Avatar
					</button>
				</span>
				<span className="playerSettingsFormInputs">
					<span>Name : </span>
					<span>
						<input
							className="profileSettingsInputFields"
							type="text"
							placeholder="Username..."
							value={name}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</span>
					<span>Email : </span>
					<span>
						<input
							className="profileSettingsInputFields"
							type="text"
							placeholder="Email..."
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</span>
					<span>Password : </span>
					<span>
						<input
							className="profileSettingsInputFields"
							type="password"
							placeholder="Password..."
							onChange={(e) => setNewPassword(e.target.value)}
						/>
					</span>
				</span>
				<span>
					<button
						id="updateUserInfo"
						className="settingsActionButton"
						onClick={handleChange}
						type="submit"
						value="Update"
					>
						Update
					</button>
				</span>
			</form>
		</div>
	);
};

export default SettingsView;
