import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/cn-icon.png";
import logoutIcon from "../assets/images/logoutIcon2.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";
import "../assets/css/navbar.css";

const Navbar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const userState = useSelector((state) => state.userLogin);
	let [authState, setAuthState] = useState("INITILIAZE");

	useEffect(() => {
		let result = "UNAUTHORIZED";

		if (userState.userInfo !== null && userState.userInfo !== undefined) {
			if ("name" in userState.userInfo) {
				result = "AUTHORIZED";
			} else if ("message" in userState.userInfo) {
				result = "UNAUTHORIZED";
			}
		}
		console.log(userState.userInfo);
		console.log(result);
		setAuthState(result);
		// eslint-disable-next-line
	}, [userState]);

	const logoutHandler = () => {
		dispatch(logout());
        navigate("/");
	};

	function handleChange(e) {
		if (e.target.id === "userAuthPageLink") {
			navigate("/auth");
		} else if (e.target.id === "userProfilePageLink") {
			if (userState.userInfo !== null && userState.userInfo !== undefined) {
				if ("isAdmin" in userState.userInfo) {
					if (userState.userInfo.isAdmin) {
						navigate("/profile/players");
					}
				}
			}
			navigate("/profile");
		}
	}

	return (
		<div data-testid="navbarContent">
			<header>
				<span className="navBarLogoSection">
					<span>
						<img src={logo} alt="Logo" height="50" />
					</span>
					<span>
						<h2 className="company-logo">
							<NavLink to="/">CODENAMES</NavLink>
						</h2>
					</span>
				</span>
				<span className="navBarUserSection">
					{authState !== "AUTHORIZED" && (
						<button
							id="userAuthPageLink"
							className="userActionButton userActionButtonShadowRight"
							style={{ marginRight: "5px" }}
							onClick={handleChange}
						>
							Login/Sign Up
						</button>
					)}
					{authState === "AUTHORIZED" && (
						<button
							id="userProfilePageLink"
							className="userActionButton userActionButtonShadowRight"
							style={{ marginRight: "5px" }}
							onClick={handleChange}
						>
							My Profile
						</button>
					)}
					{authState === "AUTHORIZED" && (
						<button
							className="userActionButton userActionButtonShadowRight"
							style={{ marginLeft: "5px" }}
							onClick={logoutHandler}
						>
							<img src={logoutIcon} alt="Logo" height="100%" />
						</button>
					)}
				</span>
			</header>
		</div>
	);
};

export default Navbar;
