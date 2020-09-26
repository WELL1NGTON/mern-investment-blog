const router = require("express").Router();
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

const ACCESS_TOKEN_EXPIRATION_TIME = "15s";
const REFRESH_TOKEN_EXPIRATION_TIME = "30d";

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

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const newRefreshToken = new RefreshToken({
        user_id: user.id,
        token: refreshToken,
      });
      newRefreshToken.save();

      res
        .cookie("access-token", accessToken, { httpOnly: true })
        .cookie("refresh-token", refreshToken, { httpOnly: true })
        .json({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
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
    .then((user) => res.json({ user }))
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   delete auth/logout
// @desc    Logout user
// @access  Private
router.route("/logout").delete(auth, (req, res) => {
  RefreshToken.findOneAndDelete({ token: req.refreshToken })
    .then(() =>
      res
        .clearCookie("refresh-token")
        .clearCookie("access-token")
        .json({ success: true })
    )
    .catch((err) => res.status(400).json("Error: " + err));
});

// @route   get auth/logout
// @desc    Refresh user access token
// @access  Public
router.route("/refresh").get((req, res) => {
  if (req && req.cookies && req.cookies["refresh-token"]) {
    RefreshToken.findOne({ token: req.cookies["refresh-token"] })
      .then((tokenDoc) => {
        const refreshToken = tokenDoc.token;
        try {
          const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
          );
          req.user = decoded;
          const accessToken = generateAccessToken(req.user);
          res
            .cookie("access-token", accessToken, { httpOnly: true })
            .json({ success: true });
        } catch {
          RefreshToken.findByIdAndDelete(refreshToken);
          res
            .status(400)
            .clearCookie("refresh-token")
            .clearCookie("access-token")
            .json({ msg: "Refresh token is not valid" });
        }
      })
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
  });
}

function generateRefreshToken(user) {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION_TIME,
  });
}

module.exports = router;
