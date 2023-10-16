import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../components/Sidebar";
import "./profile.css";

const ProfileView = () => {
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
		console.log(pageState);
		setPageState(result);
		// eslint-disable-next-line
	}, [userState]);

	return (
		<div className="profileContent">
			<Sidebar />
			<span className="outletContent">
				<Outlet />
			</span>
		</div>
	);
};

export default ProfileView;
