const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const refreshhandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshtoken = cookies.refreshToken;
  const foundUser = await User.findOne({ refreshtoken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, decoded) => {
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);
    const accessToken = jwt.sign(
      {
        iserinfo: {
          id: decoded._id,
          username: foundUser.username,
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: '200s' }
    );
  });
  res.json(accessToken);
}

module.exports = { refreshhandler };  