const Room = require("../models/roomDetailModel");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc Get all Rooms
// @route GET /rooms
// @access Private
const getAllRooms = asyncHandler(async (req, res) => {
  // Get all rooms from MongoDB
  const rooms = await Room.find().lean();

  // If no rooms are available/active
  if (!Room?.length) {
    return res.status(400).json({ message: "No Room active" });
  }
  const roomsWithUser = await Promise.all(
    rooms.map(async (room) => {
      const user = await User.findById(room.user).lean().exec();
      return { ...room, username: user.username };
    })
  );

  res.json(roomsWithUser);
});

module.exports = { getAllRooms };
