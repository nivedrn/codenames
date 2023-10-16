const User = require("../models/userModel");
const usersController = require("../controllers/userController");
const { protect, authAdmin } = require("../middleware/authMiddleware.js");
const passport = require("passport");
const express = require("express");
const router = express.Router();

router.route("/").post(usersController.registerUser);
router.route("/login").post(usersController.authUser);
router.route("/update").post(protect, usersController.updateUserProfile);
router.route("/block/:id").patch(usersController.BlockUser);
router.route("/:id").delete(protect, usersController.delUser);
router.route("/fetchUsers").get(authAdmin, usersController.fetchUsers);
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

module.exports = router;
