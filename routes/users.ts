import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import { auth } from "../middleware/auth";
import { IUserInfo } from "../util/jwtTokens";

const router = express.Router();

// @route   POST users
// @desc    Register new user
// @access  Private
router.route("/register/").post(auth, (req, res) => {
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

    bcrypt.genSalt(10, (err: Error, salt: string) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;

        newUser
          .save()
          .then((user) => {
            const userDecoded: IUserInfo = {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
            res.status(200).json({ user: userDecoded });
            // generateAccessToken(userDecoded);
            // jwt.sign(
            //   { id: user.id },
            //   process.env.ACCESS_TOKEN_SECRET,
            //   {
            //     expiresIn: 600,
            //   },
            //   (err, token) => {
            //     if (err) throw err;
            //     res.json({
            //       token,
            //       user: {
            //         id: user.id,
            //         name: user.name,
            //         email: user.email,
            //       },
            //     });
            //   }
            // );
          })
          .catch((err) => res.status(400).json("Error: " + err));
      });
    });
  });
});

module.exports = router;
