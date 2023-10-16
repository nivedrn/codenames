import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { guestUser } from "../../actions/userAction";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { generateRandomAvatar } from "../../actions/helperAction";
import "./auth.css";

const AuthView = () => {
	const { action, roomId } = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userState = useSelector((state) => state.userLogin);

	let [authPageMessage, setAuthPageMessage] = useState("");
	let [guestUserName, setGuestUserName] = useState("");
	let [authState, setAuthState] = useState("UNAUTHORIZED");
	let [pageState, setPageState] = useState("INITIALIZE");

	useEffect(() => {
		// eslint-disable-next-line
	}, [authState, pageState, authPageMessage]);

	useEffect(() => {
		let result = "INITIALIZE";
		let message = "Please login or sign up to create a room.";

		if (userState !== null) {
			if (userState.userInfo !== null) {
				if ("name" in userState.userInfo) {
					setAuthState("AUTHORIZED");
					message = "Successfully Logged In.";
				} else if ("message" in userState.userInfo) {
					setAuthState("UNAUTHORIZED");
					message = userState.userInfo.message;
				}
			} else {
				setAuthState("UNAUTHORIZED");
			}
		}

		if (action !== undefined) {
			if (action === "createroom") {
				if (userState.userInfo !== null) {
					if ("name" in userState.userInfo) {
						result = "SHOW_CREATE_ACTIONS";
					} else if ("message" in userState.userInfo) {
						result = "CREATE_OPTIONS";
						message = userState.userInfo.message;
					}
				} else {
					result = "CREATE_OPTIONS";
				}
			} else if (action === "join") {
				if (roomId === undefined) {
					result = "CREATE_OPTIONS";
					message = "Room ID not specified. Login or Register to create room ";
				} else {
					if (userState.userInfo !== null) {
						if ("name" in userState.userInfo) {
							navigate("/room/" + roomId);
						} else if ("message" in userState.userInfo) {
							result = "JOIN_OPTIONS";
							message = userState.userInfo.message;
						}
					} else {
						result = "JOIN_OPTIONS";
                        message = "Please login or sign up or continue as guest to join a room.";
					}
				}
			} else {
				if ("name" in userState.userInfo) {
					result = "SHOW_CREATE_ACTIONS";
				} else if ("message" in userState.userInfo) {
					result = "CREATE_OPTIONS";
					message = userState.userInfo.message;
				} else {
					result = "CREATE_OPTIONS";
				}
			}
		}

		setPageState(result);
		setAuthPageMessage(message);

		// eslint-disable-next-line
	}, [userState]);

	function handleChange(e) {
		if (e.target.id === "guestUserName") {
			setGuestUserName(e.target.value);
		}
	}

	function createGuestSession() {
		console.log("createGuestSession");
		dispatch(guestUser(guestUserName, generateRandomAvatar()));
	}

	return (
		<div className="authContent">
			<div className="authPageMessage">
				<h2>{authPageMessage}</h2>
			</div>
			{authState !== "AUTHORIZED" && (
				<div className="authForms">
					<LoginForm />
					<RegisterForm />
				</div>
			)}
			{authState === "AUTHORIZED" && (
				<div className="authNextAction">
					{userState.userInfo !== null &&
						userState.userInfo.next !== undefined &&
						userState.userInfo.next.map((row, index) => {
							return (
								<span className="nextActioButton" onClick={() => navigate(row.link)}>
									{row.descr}
								</span>
							);
						})}
				</div>
			)}
			{authState !== "AUTHORIZED" && pageState === "JOIN_OPTIONS" && (
				<div className="authGuest">
					<input
						type="text"
						id="guestUserName"
						className="authGuestName"
						onChange={handleChange}
						placeholder="enter name"
						autoComplete="off"
					/>
					<button
						className="guestActionButton"
						onClick={() => createGuestSession()}
					>
						Continue as a guest...
					</button>
				</div>
			)}
		</div>
	);
};

export default AuthView;
