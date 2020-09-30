exports.cookieExtractor = (req) => {
  let accessToken = null;
  let refreshToken = null;
  if (req && req.cookies) {
    accessToken = req.cookies["access-token"];
    refreshToken = req.cookies["refresh-token"];
  }
  return { accessToken, refreshToken };
};
