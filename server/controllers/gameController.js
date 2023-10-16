var gameData = require("../data/gameData.js");
const Wordpack = require("../models/wordPackModel");
const Word = require("../models/wordModel");
const asyncHandler = require("express-async-handler");

function generateRoom() {
	var roomId = randomId();
	while (Object.keys(gameData).includes(roomId) && roomId.length !== 6) {
		roomId = randomId();
	}

	gameData[roomId] = {
		roomDetails: {
			roomId: roomId,
			roomLink: "",
			wordPack: "All",
			roomState: "LOBBY",
			roomVisibility: "PUBLIC",
			roomPassword: "",
			roomAccess: "PUBLIC",
			randomizeRolesEveryGame: false,
			randomizeTeamsEveryGame: true,
			turnDuration: 60,
		},
		playerDetails: {},
		boardDetails: {},
		turnDetails: {
			currentTurn: true,
			timer: 60,
			clue_word: "",
			clue_number: "",
			showClue: false,
			votes: {},
		},
	};

	fetchNewBoard(roomId);

	return roomId;
}

function validateRoom(roomId) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		return true;
	}
	return false;
}

function fetchRoomDetails(roomId) {
	var result = {};
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		result["details"] = gameData[roomId];
		result["status"] = "SUCCESS";
		result["message"] = "Fetched all details related to this room.";
	} else {
		result["status"] = "ERROR";
		result["message"] = "ROOM ID not found";
	}
	return result;
}

function fetchNewBoard(roomId) {
	// First Turn: true for Team Blue, false for Team Red
	var result = {
		stage: "NEW",
		firstTurn: true,
		wordList: [],
		score: { BLUE: 0, RED: 0 },
		message: "",
	};

	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		if (gameData[roomId].roomDetails.roomState === "GAME") {
			result.firstTurn = !gameData[roomId].boardDetails.firstTurn;
		} else {
			result.firstTurn = Math.random() < 0.5;
		}

		gameData[roomId].turnDetails.currentTurn = result.firstTurn;
	}

	var wordList = [
		"Armada",
		"Asleep",
		"Astronaut",
		"Athlete",
		"Atlantis",
		"Aunt",
		"Avocado",
		"Baby-Sitter",
		"Backbone",
		"Bag",
		"Bus",
		"Buy",
		"Cabin",
		"Cafeteria",
		"Cake",
		"Calculator",
		"Campsite",
		"Can",
		"Canada",
		"Knife",
		"Knight",
		"Koala",
		"Lace",
		"Ladder",
		"Zoo",
	];

	//   let randWords = generateRandomWordList(gameData[roomId].roomDetails.wordPack, 25, []);
	//   console.log(randWords.length);

	var typeList = [];

	for (var i = 0; i < wordList.length; i++) {
		if (i < 9) {
			if (result.firstTurn) {
				typeList.push("BLUE");
			} else {
				typeList.push("RED");
			}
		} else if (i >= 9 && i < 17) {
			if (result.firstTurn) {
				typeList.push("RED");
			} else {
				typeList.push("BLUE");
			}
		} else if (i == 17) {
			typeList.push("BLACK");
		} else {
			typeList.push("NEUTRAL");
		}
	}

	wordList.forEach((item) => {
		let typeIndex = Math.floor(Math.random() * typeList.length);
		var wordType = typeList[typeIndex];
		typeList.splice(typeIndex, 1);

		result.wordList.push({
			word: item,
			type: wordType,
			revealed: false,
		});
	});

	gameData[roomId].boardDetails = result;

	return result;
}

function modifyBoardStage(roomId, playerId, newStage) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		gameData[roomId].boardDetails.stage = newStage;
		console.log("Modified board stage to " + newStage);
		return gameData[roomId].boardDetails;
	}
	return {};
}

function modifyRoomState(roomId, playerId, changedState) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		gameData[roomId].roomDetails.roomState = changedState;
		gameData[roomId].turnDetails.timer =
			gameData[roomId].roomDetails.turnDuration;
		console.log("Modified room state to " + changedState);
		return gameData[roomId].roomDetails;
	}
	return {};
}

function addNewPlayer(roomId, playerId, playerData, socket) {
	if (
		gameData[roomId] !== undefined &&
		gameData[roomId] !== null &&
		playerId !== null
	) {
		gameData[roomId].playerDetails[playerId] = {
			playerId: playerId,
			username: "name" in playerData ? playerData.name : "Guest",
			socketId: socket.id,
			isSpyMaster: false,
			team: "SPECTATOR",
			avatar: "pic" in playerData ? playerData.pic : "Guest",
		};

		return gameData[roomId].playerDetails;
	}
}

function modifyPlayerDetails(roomId, playerId, type, value) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		if (
			gameData[roomId].playerDetails[playerId] !== undefined &&
			gameData[roomId].playerDetails[playerId] !== null
		) {
			if (type === "TEAM") {
				gameData[roomId].playerDetails[playerId].team = value;
				console.log("Changed team to " + value + " for player: " + playerId);
			} else if (type === "ROLE") {
				gameData[roomId].playerDetails[playerId].isSpyMaster =
					value === "SPYMASTER" ? true : false;
				console.log("Changed role to " + value + " for player: " + playerId);
			}
		}
		return gameData[roomId].playerDetails;
	}
	return {};
}

function modifyRoomSettings(roomId, playerId, actionType, value) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		if (actionType === "RANDOMIZE_ROLES") {
			gameData[roomId].roomDetails.randomizeRolesEveryGame = value;
		} else if (actionType === "RANDOMIZE_TEAMS") {
			gameData[roomId].roomDetails.randomizeTeamsEveryGame = value;
		} else if (actionType === "TURN_DURATION") {
			gameData[roomId].roomDetails.turnDuration = parseInt(value);
			gameData[roomId].turnDetails.timer = parseInt(value);
		} else if (actionType === "FETCH") {
			// Return turnDetails for specified room.
		}
		return gameData[roomId].roomDetails;
	}
	return {};
}

function modifyTurnDetails(roomId, playerId, turnAction) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		if (turnAction === "END_TURN") {
			gameData[roomId].turnDetails = {
				currentTurn: !gameData[roomId].turnDetails.currentTurn,
				timer: gameData[roomId].roomDetails.turnDuration,
				clue_word: "",
				clue_number: "",
				showClue: false,
				votes: {},
			};

			console.log("Turn ended by " + playerId);
		} else if (turnAction === "COUNTDOWN_TIMER") {
			gameData[roomId].turnDetails.timer -= 1;
			if (gameData[roomId].turnDetails.timer == 0) {
				gameData[roomId].turnDetails.currentTurn =
					!gameData[roomId].turnDetails.currentTurn;
				gameData[roomId].turnDetails.timer =
					gameData[roomId].roomDetails.turnDuration;
			}
		} else if (turnAction === "RESET_TIMER") {
			gameData[roomId].turnDetails.timer =
				gameData[roomId].roomDetails.turnDuration;
		} else if (turnAction === "FETCH") {
			// Return turnDetails for specified room.
		}
		return gameData[roomId].turnDetails;
	}
	return {};
}

function modifyTurnClues(roomId, playerId, clueType, value) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		if (clueType === "UPDATE_CLUEWORD") {
            let regex = /[\W_0-9]/g;  
            if(regex.test(value)){
                gameData[roomId].turnDetails.clue_word = "Clue cannot contain special characters";
            }else if(value.split(" ").length == 1){
                if (
                    gameData[roomId].boardDetails.wordList.filter(
                        (item) => value.toLowerCase().includes(item.word.toLowerCase()) 
                    ).length > 0
                ) {
                    gameData[roomId].turnDetails.clue_word = "Clue cannot contain any words on board";
                } else {
                    gameData[roomId].turnDetails.clue_word = value;
                }
            }else{
                gameData[roomId].turnDetails.clue_word = "Only 1 word clue is allowed";
            }
		} else if (clueType === "UPDATE_CLUENUMBER") {
			gameData[roomId].turnDetails.clue_number = ( value > 9 ? 9 : value < 0 ? 0 : value);
		} else if (clueType === "SHOW_CLUE") {
			gameData[roomId].turnDetails.showClue = value;
		}
		return gameData[roomId].turnDetails;
	}
	return {};
}

function removeDisconnectedPlayer(roomId, socketId) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		var disconnectedPlayer = Object.values(
			gameData[roomId].playerDetails
		).filter(function (player) {
			return player.socketId === socketId;
		});

		if (disconnectedPlayer.length > 0) {
			delete gameData[roomId].playerDetails[disconnectedPlayer[0].playerId];
		}

		return gameData[roomId].playerDetails;
	}
	return {};
}

function remainingPlayersInRoom(roomId) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		return Object.keys(gameData[roomId].playerDetails).length;
	}
	return 0;
}

function randomId() {
	return Math.floor(Math.random() * 16777215).toString(16);
}

function fetchWordPacks() {
	let result = [];
	let wordPacks = ["All", "Easy", "Medium"];
	wordPacks.forEach((item) => {
		result.push({
			packName: item,
			description: "Default Description",
		});
	});
	return result;
}

function processWordCardAction(roomId, playerId, selectedWord, turnAction) {
	if (gameData[roomId] !== undefined && gameData[roomId] !== null) {
		if (turnAction === "VOTE") {
			if (gameData[roomId].turnDetails.votes[selectedWord] === undefined) {
				gameData[roomId].turnDetails.votes[selectedWord] = [];
			}

			if (
				!gameData[roomId].turnDetails.votes[selectedWord].includes(playerId)
			) {
				gameData[roomId].turnDetails.votes[selectedWord].push(playerId);
			}
		} else if (turnAction === "SELECT") {
			currentWord = gameData[roomId].boardDetails.wordList.find(
				(item) => item.word === selectedWord
			);
			currentWord.revealed = true;

			if (currentWord.type === "BLUE") {
				gameData[roomId].boardDetails.score["BLUE"] = gameData[
					roomId
				].boardDetails.wordList.filter(
					(item) => item.type === "BLUE" && item.revealed === true
				).length;
			} else if (currentWord.type === "RED") {
				gameData[roomId].boardDetails.score["RED"] = gameData[
					roomId
				].boardDetails.wordList.filter(
					(item) => item.type === "RED" && item.revealed === true
				).length;
			}

			if (gameData[roomId].playerDetails[playerId].team !== currentWord.type) {
				modifyTurnDetails(roomId, playerId, "END_TURN");
				if (currentWord.type === "BLACK") {
					if (gameData[roomId].playerDetails[playerId].team === "BLUE") {
						gameData[roomId].boardDetails.stage = "VICTORY RED TEAM";
						gameData[roomId].boardDetails.message =
							"BLACK WORD selected by BLUE team.";
					} else if (gameData[roomId].playerDetails[playerId].team === "RED") {
						gameData[roomId].boardDetails.stage = "VICTORY BLUE TEAM";
						gameData[roomId].boardDetails.message =
							"BLACK WORD selected by RED team.";
					}
				}
			} else {
				if (
					(!gameData[roomId].boardDetails.firstTurn &&
						gameData[roomId].boardDetails.score["BLUE"] == 8) ||
					(gameData[roomId].boardDetails.firstTurn &&
						gameData[roomId].boardDetails.score["BLUE"] == 9)
				) {
					gameData[roomId].boardDetails.stage = "VICTORY BLUE TEAM";
					gameData[roomId].boardDetails.message =
						"All operatives uncovered by BLUE TEAM.";
				} else if (
					(gameData[roomId].boardDetails.firstTurn &&
						gameData[roomId].boardDetails.score["RED"] == 8) ||
					(!gameData[roomId].boardDetails.firstTurn &&
						gameData[roomId].boardDetails.score["RED"] == 9)
				) {
					gameData[roomId].boardDetails.stage = "VICTORY RED TEAM";
					gameData[roomId].boardDetails.message =
						"All operatives uncovered by RED TEAM.";
				}
			}

			console.log(gameData[roomId].playerDetails[playerId]);
		}
		console.log(
			gameData[roomId].boardDetails.wordList.find(
				(item) => item.word === selectedWord
			)
		);
		return gameData[roomId].boardDetails;
	}
	return {};
}

const generateRandomWordList = asyncHandler(
	async (wordpack, count, existingsList) => {
		if (wordpack !== "All") {
			let packname = await Wordpack.findOne({ name: wordpack });
		}

		const words = await Word.aggregate([
			{
				$match: {
					$and: [
						{ wordPack: wordpack === "All" ? "/*/" : packname._id },
						{ name: { $nin: existingsList } },
					],
				},
			},
			{ $sample: { size: count } },
		]);

		return { count: words.length, data: words };
	}
);

module.exports = {
	generateRoom,
	validateRoom,
	fetchRoomDetails,
	fetchNewBoard,
	fetchWordPacks,
	addNewPlayer,
	modifyBoardStage,
	modifyRoomState,
	modifyRoomSettings,
	modifyPlayerDetails,
	modifyTurnDetails,
	modifyTurnClues,
	processWordCardAction,
	remainingPlayersInRoom,
	removeDisconnectedPlayer,
};
