const mongoose = require("mongoose");

const roomDetails = mongoose.Schema(
  {
    roomLink: {
      type: String,
      required: true,
    },
    wordPack: {
      type: String,
      required: true,
      unique: true,
      minlength: 25,
    },
    roomState: {
      type: Boolean,
      enum: ["LOBBY", "GAME"],
      default: "LOBBY",
      required: true,
    },
    roomVisibility: {
      type: Boolean,
      required: true,
    },
    roomPassword: {
      type: String,
      required: true,
    },
    randomizeRolesEveryGame: {
      type: Boolean,
      default: true,
    },
    randomizeTeamsEveryGame: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomDetails);

module.exports = Room;
