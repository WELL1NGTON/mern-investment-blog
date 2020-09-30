const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken.model");
// const cookieExtractor = require("../util/cookieExtractor");
// import cookieExtractor from "../util/cookieExtractor";

function cookieExtractor(req) {
  let accessToken = null;
  let refreshToken = null;
  if (req && req.cookies) {
    accessToken = req.cookies["access-token"];
    refreshToken = req.cookies["refresh-token"];
  }
  return { accessToken, refreshToken };
}

async function refreshAccessToken(refreshToken) {
  try {
    // Verify token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Add user from payload
    req.user = decoded;

    const doc = await RefreshToken.findOne({ token: refreshToken });
    if (doc) {
      const accessToken = jwt.sign(
        { id: decoded.id },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRATION_TIME,
        }
      );
      return accessToken;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function auth(req, res, next) {
  const { accessToken, refreshToken } = cookieExtractor(req);

  // Check for token
  if (!accessToken)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    // Verify token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Add user from payload
    req.user = decoded;
    req.accessToken = accessToken;
    req.refreshToken = refreshToken;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token is not valid" });
  }
}

module.exports = auth;
