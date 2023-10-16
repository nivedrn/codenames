//var gameData = require("./data/gameData.js");
const {
	addNewPlayer,
	fetchNewBoard,
	modifyBoardStage,
	modifyRoomState,
    modifyRoomSettings,
	modifyPlayerDetails,
	modifyTurnDetails,
    modifyTurnClues,
	removeDisconnectedPlayer,
	remainingPlayersInRoom,
	processWordCardAction,
} = require("../controllers/gameController.js");

var timerInterval = {};

module.exports = (io) => {
	io.on("connection", (socket) => {
		socket.on("join-room", (roomId, playerId, playerData, callback) => {
			socket.join(roomId);
			io.in(roomId).emit(
				"playerDetails-update",
				addNewPlayer(roomId, playerId, playerData, socket)
			);
			console.log(
				socket.id + " player (" + playerId + ") joined ROOM ID:" + roomId
			);
			callback({
				roomId: roomId,
				message: socket.id + " joined ROOM ID:" + roomId,
			});
		});

		socket.on("modify-roomDetails", (roomId, playerId, changedState) => {
			io.in(roomId).emit(
				"roomDetails-update",
				modifyRoomState(roomId, playerId, changedState)
			);
		});

		socket.on("modify-playerTeam", (roomId, playerId, teamName) => {
			io.in(roomId).emit(
				"playerDetails-update",
				modifyPlayerDetails(roomId, playerId, "TEAM", teamName)
			);
		});

		socket.on("modify-playerRole", (roomId, playerId, roleName) => {
			io.in(roomId).emit(
				"playerDetails-update",
				modifyPlayerDetails(roomId, playerId, "ROLE", roleName)
			);
		});

		socket.on("modify-turnDetails", (roomId, playerId, turnAction) => {
			io.in(roomId).emit(
				"turnDetails-update",
				modifyTurnDetails(roomId, playerId, turnAction)
			);
		});

		socket.on("modify-boardStage", (roomId, playerId, stageName) => {
			io.in(roomId).emit(
				"boardDetails-update",
				modifyBoardStage(roomId, playerId, stageName)
			);

			if (stageName === "INPROGRESS") {
				var countdown = 1000;
				timerInterval[roomId] = setInterval(function () {
					io.in(roomId).emit(
						"turnDetails-update",
						modifyTurnDetails(roomId, playerId, "COUNTDOWN_TIMER")
					);
				}, 1000);
			}
		});

		socket.on("modify-roomSettings", (roomId, playerId, actionType, value) => {
			io.in(roomId).emit(
				"roomDetails-update",
				modifyRoomSettings(roomId, playerId, actionType, value)
			);
            io.in(roomId).emit(
				"turnDetails-update",
				modifyTurnDetails(roomId, "", "FETCH")
			);
		});

		socket.on("fetch-newBoard", (roomId) => {
			io.in(roomId).emit("boardDetails-update", fetchNewBoard(roomId));
			clearInterval(timerInterval[roomId]);
			io.in(roomId).emit(
				"turnDetails-update",
				modifyTurnDetails(roomId, "", "RESET_TIMER")
			);
		});

		socket.on("modify-turnClues", (roomId, playerId, clueType, value) => {
			io.in(roomId).emit(
				"turnDetails-update",
				modifyTurnClues(roomId, playerId, clueType, value)
			);
		});

		socket.on(
			"broadcast-wordCardAction",
			(roomId, playerId, word, turnAction) => {
				let result = processWordCardAction(roomId, playerId, word, turnAction);

				io.in(roomId).emit("boardDetails-update", result);

				if (result.stage !== "INPROGRESS") {
					clearInterval(timerInterval[roomId]);
				}

				io.in(roomId).emit(
					"turnDetails-update",
					modifyTurnDetails(roomId, "", "FETCH")
				);
			}
		);

		socket.on("disconnecting", () => {
			console.log("disconnecting from : ");
			console.log(socket.rooms); // the Set contains at least the socket ID

			socket.rooms.forEach(function (roomId) {
				console.log(socket.id + " disconnecting from " + roomId);
				io.in(roomId).emit(
					"playerDetails-update",
					removeDisconnectedPlayer(roomId, socket.id)
				);

				var remaningPlayerCount = remainingPlayersInRoom(roomId);
				console.log(
					"Remaining players in room " + roomId + " : " + remaningPlayerCount
				);
				if (remainingPlayersInRoom < 1) {
					clearInterval(timerInterval[roomId]);
				}
			});
		});

		socket.on("disconnected", () => {
			console.log(socket.id + " disconnected.");
		});

		socket.on("connect_error", (err) => {
			console.log(`connect_error due to ${err.message}`);
		});
	});
};
