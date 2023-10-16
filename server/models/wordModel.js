const mongoose = require("mongoose");

const wordModel = mongoose.Schema(
  {
    wordPack: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Wordpack",
    },

    word: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Word = mongoose.model("Word", wordModel);

module.exports = Word;
