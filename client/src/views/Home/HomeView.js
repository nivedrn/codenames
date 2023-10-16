import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./home.css";
import { SERVER_HOST } from "../../constants/apiConstants";

const Home = (props) => {
	const navigate = useNavigate();
	const userLogin = useSelector((state) => state.userLogin);

	const [redirectUrl, setRedirectUrl] = useState(null);
	const [joinRoomId, setJoinRoomId] = useState(null);
	const [homePageMessage, setHomePageMessage] = useState(
		props.message !== undefined ? props.message : ""
	);

	function createNewRoom() {
		if (userLogin.userInfo !== null) {
			fetch(SERVER_HOST + "/game/newroom")
				.then((resp) => resp.json())
				.then((data) => {
					console.log(data);
					setRedirectUrl("/room/" + data.roomId);
				});
		} else {
			setRedirectUrl("/auth/createroom");
		}
	}

	function joinRoom() {
		console.log(joinRoomId);
		if (joinRoomId !== null && joinRoomId !== "") {
			fetch(SERVER_HOST + "/game/validateRoom/" + joinRoomId)
				.then((resp) => resp.json())
				.then((data) => {
					console.log(data);
					if (data.isValid) {
						if (userLogin.userInfo !== null) {
							setRedirectUrl("/room/" + joinRoomId);
						} else {
							setRedirectUrl("/auth/join/" + joinRoomId);
						}
					} else {
						setHomePageMessage("No room found with Id : " + joinRoomId);
					}
				});
		}
	}

	function handleChange(e) {
		if (e.target.id === "room_id") {
			setJoinRoomId(e.target.value);
		}
		console.log(joinRoomId);
	}

	useEffect(() => {
		if (redirectUrl !== undefined && redirectUrl !== "") {
			navigate(redirectUrl);
		}
	}, [redirectUrl, navigate]);

	return (
		<div data-testid="homeContent">
			<main>
				<div className="home-page-logo-container">CODENAMES</div>
				<div className="actions-class">
					<span>
						<button className="create-room-btn" onClick={() => createNewRoom()}>
							Create a Room
						</button>
					</span>
					<span>
						<button className="join-room-btn" onClick={() => joinRoom()}>
							Join a Room
						</button>
						<input
							className="room_code"
							type="text"
							id="room_id"
							placeholder="Enter 6 letter code..."
							onChange={handleChange}
						/>
					</span>
				</div>
				{props.message !== "" && (
					<div className="homePageMessage">{homePageMessage}</div>
				)}
				<div className="how-to-play">
					<h1>How to play</h1>
					<div className="rules-container">
						<p className="rules-class">
							<span>1.</span> Click on the CREATE ROOM button.
						</p>
						<p className="rules-class">
							<span>2.</span> Select the preferred game settings and start the
							game.
						</p>
						<p className="rules-class">
							<span>3.</span> Connect with your friends using your favorite
							audio or video chat.
						</p>
						<p className="rules-class">
							<span>4.</span> Share the room URL with your friends.
						</p>
						<p className="rules-class">
							<span>5.</span> Enjoy the game!
						</p>
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
