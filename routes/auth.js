const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// @route   POST auth/login
// @desc    Auth user (login)
// @access  Public
router.route("/login").post((req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Por favor, preencha todos os campos" });

  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ msg: "Usuário não existe." });

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "invalid credentials" });

      const accessToken = generateToken(
        user,
        process.env.ACCESS_TOKEN_SECRET,
        "600s"
      );
      const refreshToken = generateToken(
        user,
        process.env.REFRESH_TOKEN_SECRET
      );
      res.json({
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  });
});

// @route   get auth/user
// @desc    Auth user
// @access  Private
router.route("/user").get(auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   get auth/user
// @desc    Auth user
// @access  Private
router.route("/user").get(auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json("Error: " + err));
});

function generateToken(user, SECRET, expiresIn = "0") {
  if (expiresIn !== "0" && expiresIn !== "0s")
    return jwt.sign({ id: user.id }, SECRET, { expiresIn });
  return jwt.sign({ id: user.id }, SECRET);
}

module.exports = router;
