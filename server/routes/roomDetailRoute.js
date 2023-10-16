const express = require("express");
const router = express.Router();
const roomDetailController = require("../controllers/roomDetailController");

router.route("/room").get(roomDetailController.getAllRooms);

module.exports = router;
