const asyncHandler = require("express-async-handler");
const Wordpack = require("../models/wordPackModel");
const Word = require("../models/wordModel");

const createWord = asyncHandler(async (req, res) => {
	const { word, wordpack, isActive } = req.body;
	const packname = await Wordpack.findOne({ name: req.body.wordpack });
	// console.log(packname);
	if (!word || !wordpack) {
		res.status(400);
		throw new Error("Please Fill all the feilds");
	} else {
		const newWord = await Word.create({
			wordPack: packname._id,
			word,
			isActive,
		});

		res.status(201).json(newWord);
	}
});

const createWordPack = asyncHandler(async (req, res) => {
	const { name, description, isActive } = req.body;
	if (!name || !description) {
		res.status(400);
		throw new Error("Please Fill all the feilds");
	} else {
		const wordpack = await Wordpack.create({ name, description, isActive });

		res.status(201).json(wordpack);
	}
});

const getWordList = asyncHandler(async (req, res) => {
	let { wordpack } = req.query;
	let packname = await Wordpack.findOne({ name: wordpack });

	const words = await Word.aggregate([
		{ $match: { wordPack: packname._id } },
		{ $sample: { size: 25 } },
	]);
	let wordss = generateRandomWordList(wordpack, 5, ["dog"]);
	console.log(words.length);

	if (words) {
		res.json(words);
	} else {
		res.status(404).json({ message: "words not available" });
	}

	res.json(words);
});

const getWordPacks = asyncHandler(async (req, res) => {
	const wordPacks = await Wordpack.find({
		isActive: true,
	}).lean();

	if (wordPacks) {
		res.json(wordPacks);
	} else {
		res.status(404).json({ message: "No Word Packs found." });
	}

	res.json(wordPacks);
});

const getWords = () => {
	const words = Word.find({
		isActive: true,
	})
		.filter((words) => wordpack.name)
		.populate("wordpack", "name");

	if (words) {
		res.json(words);
	} else {
		res.status(404).json({ message: "words not available" });
	}

	res.json(words);
};

const generateRandomWordList = async (wordpack, count, existingsList) => {
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

	return { count: words.length, data: words};
};

module.exports = {
	getWords,
	getWordList,
	getWordPacks,
	createWord,
	createWordPack,
    generateRandomWordList
};
