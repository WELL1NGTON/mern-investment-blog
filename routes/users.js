const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// @route   POST users
// @desc    Register new user
// @access  Private
router.route("/register/").post((req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ msg: "Por favor, preencha todos os campos" });

  User.findOne({ email }).then((user) => {
    if (user) return res.status(400).json({ msg: "Email já cadastrado." });

    const newUser = new User({
      name,
      email,
      password,
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        newUser
          .save()
          .then((user) => {
            jwt.sign(
              { id: user.id },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: 600,
              },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token,
                  user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                  },
                });
              }
            );
          })
          .catch((err) => res.status(400).json("Error: " + err));
      });
    });
  });
});

module.exports = router;
