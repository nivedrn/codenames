const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const { generateRoom } = require("../controllers/gameController");
const { param } = require("../routes");
const { getMaxListeners } = require("../server");

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, pic, role } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User Already exists");
	}

	const user = await User.create({
		name,
		email,
		isAdmin: role == "admin",
		role,
		password,
		pic,
	});

	let nextActions = [
		{
			type: "ROOM",
			descr: "Go to Room",
			link: "/room/" + generateRoom(),
		}
	];

	nextActions.push({
		type: "PROFILE",
		descr: "Edit Profile",
		link: "/profile/settings",
	});

	nextActions.push({
		type: "HOME",
		descr: "Back to Home Page",
		link: "/",
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			isGuest: false,
			role: user.role,
			pic: user.pic,
			token: generateToken(user._id),
			next: nextActions,
		});
	} else {
		res.status(400);
		throw new Error("Error Occured! ");
	}
});

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	console.log(req.params.id);
	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		let nextActions = [];

		if (user.isAdmin) {
			nextActions.push({
				type: "PLAYERS",
				descr: "Manage Players",
				link: "/profile/players",
			});
		} else {
			nextActions.push({
				type: "ROOM",
				descr: "Go to Room",
				link: "/room/" + generateRoom(),
			});
		}

		nextActions.push({
			type: "PROFILE",
			descr: "Edit Profile",
			link: "/profile/settings",
		});

		nextActions.push({
			type: "HOME",
			descr: "Back to Home Page",
			link: "/",
		});

		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			isGuest: false,
			pic: user.pic,
			token: generateToken(user._id),
			next: nextActions,
		});
	} else {
		res.status(400);
		throw new Error("Incorrect User or Password");
	}
});

// @desc Get all users
// @route GET /users
// @access Private
const fetchUsers = asyncHandler(async (req, res) => {
	// Get all users from MongoDB
	console.log(req.query);
	let { page = 1, itemsPerPage = 10, search = "" } = req.query;
	const regex = new RegExp(search, "i");

	const totalUsers = await User.aggregate([
		{
			$match: {
				$or: [
					{ name: { $regex: regex } },
					{ email: { $regex: regex } },
					{ role: { $regex: regex } },
				],
			},
		},
		{
			$count: "user_count",
		},
	]);

	console.log(totalUsers);

	const users = await User.find({
		$or: [
			{ name: { $regex: regex } },
			{ email: { $regex: regex } },
			{ role: { $regex: regex } },
		],
	})

		.select("-password")
		.sort("-createdAt")
		.limit(itemsPerPage * 1)
		.skip((page - 1) * itemsPerPage)
		.lean();

	// If no users
	if (!users?.length) {
		return res.status(400).json({ message: "No users found" });
	}

	let result = {
		count: totalUsers[0].user_count,
		data: users,
		next:
			page == Math.ceil(totalUsers[0].user_count / itemsPerPage)
				? parseInt(page)
				: parseInt(parseInt(page) + 1),
		prev: page != 1 ? parseInt(parseInt(page) - 1) : 1,
	};
	res.json(result);
});

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.pic = req.body.pic || user.pic;

		if (req.body.password) {
			user.password = req.body.password;
		}

		const updatedUser = await user.save();
		console.log(updatedUser.pic);

		res.json({
			_id: updatedUser._id,
			name: updatedUser.name,
			email: updatedUser.email,
			pic: updatedUser.pic,
			isAdmin: user.isAdmin,
			isGuest: false,
			role: user.role,
			token: generateToken(updatedUser._id),
		});
	} else {
		res.status(404);
		throw new Error("User Not Found");
	}
});

const BlockUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		user.isBlocked = !user.isBlocked;
		const updatedUser = await user.save();
		if (updatedUser.isBlocked) {
			res.json("User Blocked successfully");
		} else {
			res.json("User unBlocked successfully");
		}
	} else {
		res.status(404);
		throw new Error("User not Found");
	}
});

const delUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (req.user.role !== "Admin") {
		res.status(401);
		throw new Error("You can't perform this action");
	}
	if (user) {
		await user.remove();
		res.json({ message: "Removed" });
	} else {
		res.status(400);
		throw new Error("Not Found");
	}
});

module.exports = {
	registerUser,
	authUser,
	fetchUsers,
	updateUserProfile,
	BlockUser,
	delUser,
};
