import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { SERVER_HOST } from "../../constants/apiConstants";
import WordCard from "../../components/WordCard";
import PlayerCard from "../../components/PlayerCard";
import "./room.css";

const socket = io(SERVER_HOST, {
	transports: ["websocket"],
});

const Room = () => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	const userState = useSelector((state) => state.userLogin);
	var [roomDetails, setRoomDetails] = useState({});
	var [playerDetails, setPlayerDetails] = useState({});
	var [boardDetails, setBoardDetails] = useState({});
	var [turnDetails, setTurnDetails] = useState({});
	var [wordPacks, setWordPacks] = useState([]);

	const [playerId] = useState(
		userState.userInfo !== null && userState.userInfo !== undefined ? ("_id" in userState.userInfo
			? userState.userInfo._id
			: Math.floor(Math.random() * 16777215).toString(16)) : Math.floor(Math.random() * 16777215).toString(16)
	);

	var [playerTeams, setPlayerTeams] = useState({
		CURRENT: playerId,
		BLUE: [],
		RED: [],
		SPECTATOR: [],
	});

	let roomURL = window.location.href;

	useEffect(() => {
		// Update View on game state change
	}, [roomDetails, boardDetails, turnDetails]);

	useEffect(() => {
		var result = { CURRENT: "", BLUE: [], RED: [], SPECTATOR: [] };
		for (var key in playerDetails) {
			if (key === playerId) {
				result["CURRENT"] = playerId;
			}
			result[playerDetails[key].team].push(key);
		}

		setPlayerTeams(result);
		// eslint-disable-next-line
	}, [playerDetails]);

	useEffect(() => {
		fetch(SERVER_HOST + "/game/validateRoom/" + roomId)
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
				if (!data.isValid) {
					navigate("/404");
				}
			});

		fetch(SERVER_HOST + "/game/fetchRoomDetails/" + roomId)
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
				if (data.status === "SUCCESS") {
					joinRoom();

					setRoomDetails(data.details.roomDetails);
					setPlayerDetails(data.details.playerDetails);
					setBoardDetails(data.details.boardDetails);
					setTurnDetails(data.details.turnDetails);
				} else {
					navigate("/404");
				}
			});

		fetch(SERVER_HOST + "/game/fetchWordPacks")
			.then((resp) => resp.json())
			.then((data) => {
				console.log(data);
				setWordPacks(data);
			});

		// eslint-disable-next-line
	}, []);

	function joinRoom() {
		console.log(playerId + " joining Room " + roomId);
		console.log(userState);
		let playerData =
			userState.userInfo !== null && "_id" in userState.userInfo
				? userState.userInfo
				: null;
		if (playerData !== null) {
			socket.emit("join-room", roomId, playerId, playerData, () => {
				console.log(playerId + " Joined Room " + roomId);
			});
		} else {
			navigate("/auth/join/" + roomId);
		}
	}

	function startGame() {
		socket.emit("modify-roomDetails", roomId, playerId, "GAME", () => {
			console.log("GAME roomDetails-update to Server");
		});
	}

	function endTurn() {
		socket.emit("modify-turnDetails", roomId, playerId, "END_TURN", () => {
			console.log("END_TURN turnDetails-update to Server");
		});
	}

	function modifyPlayerTeam(teamName) {
		socket.emit("modify-playerTeam", roomId, playerId, teamName, () => {
			console.log("TEAM_CHANGE playerTeam-update to Server");
		});
	}

	function modifyPlayerRole(roleName) {
		if (roleName === "PLAYER" && boardDetails.stage === "INPROGRESS") {
			alert(
				"Cannot switch back to player role in middle of a game. Click on 'New Board' before switching roles."
			);
		} else {
			socket.emit("modify-playerRole", roomId, playerId, roleName, () => {
				console.log("ROLE_CHANGE playerRole-update to Server");
			});
		}
	}

	function fetchNewBoard() {
		socket.emit("fetch-newBoard", roomId, () => {
			console.log("NEW boardDetails-request to Server");
		});
	}

	function modifyBoardStage(stageName) {
		socket.emit("modify-boardStage", roomId, playerId, stageName, () => {
			console.log("STAGE_CHANGE boardDetails-update to Server");
		});
	}

	function wordCardAction(word, action) {
		console.log(word + " : " + action);
		socket.emit(
			"broadcast-wordCardAction",
			roomId,
			playerId,
			word,
			action,
			() => {
				console.log("WORD_CARD_ACTION turnDetails-broadcast to Server");
			}
		);
	}

	function submitClue() {
		console.log(
			"CLUE:" + turnDetails.clue_word + " , " + turnDetails.clue_number
		);
		socket.emit("modify-turnClues", roomId, playerId, "SHOW_CLUE", true, () => {
			console.log("CLUE_UPDATE turnDetails-update to Server");
		});
	}

	function copyInviteLink() {
		// Copy the text inside the text field
		navigator.clipboard.writeText(roomURL);
	}

	function modifyRoomSettings(actionType, value) {
		socket.emit(
			"modify-roomSettings",
			roomId,
			playerId,
			actionType,
			value,
			() => {
				console.log("ROOM_SETTINGS roomDetails-update to Server");
			}
		);
	}

	function handleChange(e) {
		if (e.target.id === "turnDurationInput") {
			modifyRoomSettings("TURN_DURATION", e.target.value);
		} else if (e.target.id === "randomizeRolesEveryGameCheckbox") {
			modifyRoomSettings(
				"RANDOMIZE_ROLES",
				document.getElementById(e.target.id).checked
			);
		} else if (e.target.id === "randomizeTeamsEveryGameCheckbox") {
			modifyRoomSettings(
				"RANDOMIZE_TEAMS",
				document.getElementById(e.target.id).checked
			);
		} else if (e.target.id === "gameClueWordInput") {
			socket.emit(
				"modify-turnClues",
				roomId,
				playerId,
				"UPDATE_CLUEWORD",
				e.target.value,
				() => {
					console.log("CLUE_UPDATE turnDetails-update to Server");
				}
			);
		} else if (e.target.id === "gameClueNumberInput") {
			socket.emit(
				"modify-turnClues",
				roomId,
				playerId,
				"UPDATE_CLUENUMBER",
				e.target.value,
				() => {
					console.log("CLUE_UPDATE turnDetails-update to Server");
				}
			);
		}
	}

	socket.on("roomDetails-update", (roomDetails) => {
		setRoomDetails(roomDetails);
	});

	socket.on("playerDetails-update", (playerDetails) => {
		setPlayerDetails(playerDetails);
	});

	socket.on("boardDetails-update", (boardDetails) => {
		setBoardDetails(boardDetails);
	});

	socket.on("turnDetails-update", (turnDetails) => {
		setTurnDetails(turnDetails);
	});

	socket.on("connect", () => {
		console.log(`${socket.id}`);
	});

	return (
		<>
			<div data-testid="roomContent" className="roomContent">
				<div className="blueTeam">
					<div className="blueTeamHeader">Team Blue</div>
					{playerTeams["BLUE"].map((item, index) => {
						if (playerDetails[item] !== undefined) {
							return <PlayerCard key={index} player={playerDetails[item]} />;
						} else {
							return "Player Left";
						}
					})}
					<div
						className={`blueTeamFooter ${
							playerDetails[playerId] !== undefined &&
							playerDetails[playerId].team !== "BLUE"
								? ""
								: "justifySpaceBetween"
						}`}
					>
						<span>
							{playerDetails[playerId] !== undefined &&
								playerDetails[playerId].team !== "BLUE" && (
									<button
										className="gameActionButton blueTeamButton joinBlueTeamButton"
										onClick={() => modifyPlayerTeam("BLUE")}
									>
										Join Team
									</button>
								)}
						</span>
						{roomDetails.roomState === "GAME" && (
							<span className="blueTeamScore blueTeamButton">
								{boardDetails.score !== undefined && boardDetails.score["BLUE"]}
							</span>
						)}
					</div>
				</div>
				{roomDetails.roomState === "LOBBY" && (
					<div className="initialMessage">
						{/* <span>my name is</span>
						<span>
							<input
								type="text"
								className="gameClueText playerNameInput"
								placeholder="enter name"
							/>
						</span> */}
						<div className="initialMessageContent">
							<span>INVITE</span>
							<span className="gameRoomLink" title="Click to copy invite link.">
								<span
									className="gameRoomLinkStyle"
									onClick={() => copyInviteLink()}
								>
									{roomURL}
								</span>
								<span
									className="gameRoomLinkStyle"
									onClick={() => copyInviteLink()}
								>
									copy
								</span>
							</span>
							<span>WORD PACK</span>
							<span className="wordPackList">
								{wordPacks.map((item, index) => {
									if (wordPacks !== undefined) {
										return (
											<span key={index} className="wordPack">
												{item.packName}
											</span>
										);
									} else {
										return "No Word Packs";
									}
								})}
							</span>
							<span>SETTINGS</span>
							<span className="gameSettingList">
								<span className="gameSetting">Lobby Type </span>
								<span className="gameSetting">
									<input
										id="randomizeRolesEveryGameCheckbox"
										type="checkbox"
										className="gameSettingCheckbox"
										checked={roomDetails.randomizeRolesEveryGame}
										onChange={handleChange}
									/>
									Randomize Roles Every Game
								</span>
								<span className="gameSetting">
									<input
										id="randomizeTeamsEveryGameCheckbox"
										type="checkbox"
										className="gameSettingCheckbox"
										checked={roomDetails.randomizeTeamsEveryGame}
										onChange={handleChange}
									/>
									Randomize Teams Every Game
								</span>
								<span className="gameSetting">
									<span className="displayFlex">
										Turn Duration : &nbsp;
										<input
											id="turnDurationInput"
											type="number"
											className="gameClueNumber"
											placeholder="1-9"
											min="10"
											max="300"
											step="10"
											defaultValue={roomDetails.turnDuration}
											onChange={handleChange}
										/>
										&nbsp;seconds
									</span>
								</span>
							</span>
						</div>
						<button className="startGameButton" onClick={startGame}>
							Start Game
						</button>
					</div>
				)}
				{roomDetails.roomState === "GAME" && (
					<div
						className={`gameContent ${
							turnDetails.currentTurn ? "blueBoard" : "redBoard"
						}`}
					>
						<div className="gameStatus">
							<span className="gameStatusTeam">
								turn:
								<strong>
									<span
										className={`gameStatusTeamName ${
											turnDetails.currentTurn ? "blueTeamText" : "redTeamText"
										}`}
									>
										{" "}
										{turnDetails.currentTurn ? "Team Blue" : "Team Red"}
									</span>
								</strong>
							</span>
							<span className="playerRoleDiv">
								<span
									className={`playerRole ${
										playerDetails[playerId] !== undefined
											? playerDetails[playerId].isSpyMaster
												? ""
												: "activeRole"
											: "activeRole"
									}`}
									onClick={() => modifyPlayerRole("PLAYER")}
								>
									{" "}
									Player
								</span>
								<span
									className={`playerRole ${
										playerDetails[playerId] !== undefined
											? playerDetails[playerId].isSpyMaster
												? "activeRole"
												: ""
											: ""
									}`}
									onClick={() => modifyPlayerRole("SPYMASTER")}
								>
									Spymaster
								</span>
							</span>
							<span className="gameStatusTime">
								time:{" "}
								<span
									className={`gameStatusTimer ${
										turnDetails.currentTurn ? "blueTeamText" : "redTeamText"
									}`}
								>
									{" "}
									<strong>{turnDetails.timer}</strong> secs
								</span>
							</span>
						</div>
						<div
							className={`gameBoard ${
								boardDetails.stage !== "INPROGRESS" ? "deactivatedDiv" : ""
							}`}
						>
							{boardDetails.stage !== "INPROGRESS" && (
								<div className="gameBoardOverlay">
									{boardDetails.stage === "NEW" && (
										<button
											className={`gameBoardButton ${
												turnDetails.currentTurn
													? "buttonBoxShadowLeft"
													: "buttonBoxShadowRight"
											}`}
											onClick={() => modifyBoardStage("INPROGRESS")}
										>
											Start
										</button>
									)}
									{boardDetails.stage !== "NEW" && (
										<>
											<span className="gameBoardMessage">
												{boardDetails.stage}
											</span>
											<span className="gameBoardSecondaryMessage">
												{boardDetails.message}
											</span>
											<span>
												<button
													className={`gameBoardButton ${
														turnDetails.currentTurn
															? "buttonBoxShadowLeft"
															: "buttonBoxShadowRight"
													}`}
													onClick={() => modifyBoardStage("INPROGRESS")}
												>
													Start New Game
												</button>
											</span>
										</>
									)}
								</div>
							)}
							{boardDetails.wordList.map((item, index) => {
								return (
									<WordCard
										key={index}
										word={item.word}
										type={item.type}
										playerId={playerId}
										isRevealed={item.revealed}
										votes={
											turnDetails.votes[item.word] !== undefined
												? turnDetails.votes[item.word]
												: []
										}
										isSpyMaster={
											playerDetails[playerId] !== undefined
												? playerDetails[playerId].isSpyMaster
												: false
										}
										currentTurn={turnDetails.currentTurn}
										isPlayerTurn={
											playerDetails[playerId] !== undefined
												? ((playerDetails[playerId].team === "BLUE" &&
														turnDetails.currentTurn) ||
														(playerDetails[playerId].team === "RED" &&
															!turnDetails.currentTurn)) &&
												  !playerDetails[playerId].isSpyMaster
													? true
													: false
												: false
										}
										wordCardAction={wordCardAction}
									/>
								);
							})}
						</div>
						<div className="gameActions">
							<button
								className={`gameActionButton newBoardButton ${
									turnDetails.currentTurn
										? "buttonBoxShadowLeft"
										: "buttonBoxShadowRight"
								}`}
								onClick={fetchNewBoard}
							>
								New Board
							</button>
							<span className="gameClueDiv">
								{playerDetails[playerId] !== undefined &&
									playerDetails[playerId].isSpyMaster &&
									((playerDetails[playerId].team === "BLUE" &&
										turnDetails.currentTurn) ||
										(playerDetails[playerId].team === "RED" &&
											!turnDetails.currentTurn)) &&
									playerDetails[playerId].team !== "SPECTATOR" &&
									boardDetails.stage === "INPROGRESS" && (
										<>
											<input
												id="gameClueWordInput"
												type="text"
												className="gameClueText"
												placeholder="enter 1 word clue here"
												onChange={handleChange}
											/>
											<input
												id="gameClueNumberInput"
												type="number"
												className="gameClueNumber"
												placeholder="1-9"
												min="1"
												max="9"
												onChange={handleChange}
											/>
											<button
												className={`gameActionButton newBoardButton gameClueSubmitButton ${
													turnDetails.currentTurn
														? "blueTeamButton"
														: "redTeamButton"
												}`}
												onClick={() => submitClue()}
											>
												Submit Clue
											</button>
										</>
									)}
								{playerDetails[playerId] !== undefined &&
									!playerDetails[playerId].isSpyMaster &&
									turnDetails.showClue && (
										<span className="gameClueDisplay">
											{turnDetails.clue_word}, {turnDetails.clue_number}
										</span>
									)}
							</span>
							{boardDetails.stage === "INPROGRESS" &&
								playerDetails[playerId] !== undefined &&
								((playerDetails[playerId].team === "BLUE" &&
									turnDetails.currentTurn) ||
									(playerDetails[playerId].team === "RED" &&
										!turnDetails.currentTurn)) && (
									<button
										className={`gameActionButton ${
											turnDetails.currentTurn
												? "blueTeamButton"
												: "redTeamButton"
										}`}
										onClick={endTurn}
									>
										End Turn
									</button>
								)}
						</div>
					</div>
				)}
				<div className="redTeam">
					<div className="redTeamHeader">Team Red</div>
					{playerTeams["RED"].map((item, index) => {
						if (playerDetails[item] !== undefined) {
							return <PlayerCard key={index} player={playerDetails[item]} />;
						} else {
							return "Player Left";
						}
					})}
					<div
						className={`redTeamFooter ${
							playerDetails[playerId] !== undefined &&
							playerDetails[playerId].team !== "RED"
								? ""
								: "justifySpaceBetween"
						}`}
					>
						{roomDetails.roomState === "GAME" && (
							<span className="redTeamScore redTeamButton">
								{boardDetails.score !== undefined && boardDetails.score["RED"]}
							</span>
						)}
						<span>
							{playerDetails[playerId] !== undefined &&
								playerDetails[playerId].team !== "RED" && (
									<button
										className="gameActionButton redTeamButton joinRedTeamButton"
										onClick={() => modifyPlayerTeam("RED")}
									>
										Join Team
									</button>
								)}
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default Room;
