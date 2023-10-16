import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../actions/userAction";

const Sidebar = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const userState = useSelector((state) => state.userLogin);

	let [pageState, setPageState] = useState("USER");

	useEffect(() => {
		let result = "USER";

		if (userState.userInfo !== null) {
			if ("isAdmin" in userState.userInfo) {
				if (userState.userInfo.isAdmin) {
					result = "ADMIN";
				}
			}
		}
		console.log(userState.userInfo);
		console.log(result);
		setPageState(result);
		// eslint-disable-next-line
	}, [userState]);

	const logoutHandler = () => {
		dispatch(logout());
		navigate("/");
	};

	return (
		<div className="sidebarContent">
			{pageState === "ADMIN" && (
				<span>
					<NavLink to="/profile/players">Players</NavLink>
				</span>
			)}
			<span>
				<NavLink to="/profile/settings">Settings</NavLink>
			</span>
			<span className="sidebarLogoutButton">
				<button
					className="userActionButton userActionButtonShadowRight"
					style={{ marginLeft: "5px" }}
					onClick={logoutHandler}
				>
					Logout
				</button>
			</span>
		</div>
	);
};

export default Sidebar;
