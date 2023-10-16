const express = require("express");
const router = express.Router();
const {
	createWord,
	createWordPack,
	getWordList,
	getWordPacks,
} = require("../controllers/wordController");

var gameData = require("../data/gameData.js");
const {
	generateRoom,
    validateRoom,
	fetchRoomDetails,
	fetchWordPacks
} = require("../controllers/gameController.js");

router
	.route("/rooms")
	.get((req, res) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		var game = require("../server");
		res.json({ data: gameData });
	})
	.put((req, res) => {});

router
	.route("/newroom")
	.get((req, res) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		var roomId = generateRoom();
		res.json({ roomId: roomId });
	})
	.put((req, res) => {});

router
	.route("/fetchRoomDetails/:roomId")
	.get((req, res) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		console.log(req.params.roomId);
		res.json(fetchRoomDetails(req.params.roomId));
	})
	.put((req, res) => {});

router
	.route("/validateRoom/:roomId")
	.get((req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.statusCode = 200;
		console.log(req.params.roomId);
		res.json({ isValid : validateRoom(req.params.roomId)});
	})
	.put((req, res) => {});

router
	.route("/fetchWordPacks")
	.get((req, res) => {
		res.statusCode = 200;
		res.setHeader("Content-Type", "application/json");
		res.json(fetchWordPacks());
	})
	.put((req, res) => {});

router.route("/getWord").get(getWordList);
router.route("/getWordPacks").get(getWordPacks);
router.route("/createWord").post(createWord);
router.route("/createWordPack").post(createWordPack);

module.exports = router;
