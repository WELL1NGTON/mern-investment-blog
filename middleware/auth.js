const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshToken.model");
const cookieExtractor = require("../util/cookieExtractor");

function generateAccessToken(user) {
  return jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15s",
  });
}

async function refreshAccessToken(refreshToken) {
  //todo: it was needed to verify the refreshToken against the server, but for that it would need to be an async function... ?
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const docRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    }).exec();
    if (!docRefreshToken) return { newAccessToken: null, decoded: null };
    let newAccessToken = null;
    if (decoded.email === user.email)
      newAccessToken = generateAccessToken(decoded);
    return { newAccessToken, decoded };
  } catch (e) {
    console.error(e);
    return { newAccessToken: null, decoded: null };
  }
}

async function auth(req, res, next) {
  const { accessToken, refreshToken } = cookieExtractor.extractJWTTokens(req);

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
    if (!refreshToken) {
      return res
        .status(400)
        .clearCookie("refresh-token")
        .clearCookie("access-token")
        .json({ msg: "Token is not valid" });
    }
    const { newAccessToken, decoded } = await refreshAccessToken(refreshToken);
    if (!newAccessToken || !decoded) {
      RefreshToken.findOneAndDelete({ token: refreshToken }).exec();
      return res
        .status(400)
        .clearCookie("refresh-token")
        .clearCookie("access-token")
        .json({ msg: "Refresh token is not valid" });
    }
    req.user = decoded;
    req.accessToken = newAccessToken;
    req.refreshToken = refreshToken;
    res.cookie("access-token", newAccessToken, { httpOnly: true });
    next();
  }
}

module.exports = auth;
