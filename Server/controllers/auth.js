const JWT = require("jsonwebtoken");
const { User } = require("../models/user");
const { JWT_SECRET } = require("../config/config");

signToken = user => {
  return JWT.sign(
    {
      iss: "asdfghj",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)
    },
    JWT_SECRET
  );
};

module.exports = {
  signUp: async (req, res, next) => {
    const { name, email, password, age, city, diseases, interests } = req.body;

    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      return res.status(403).json({ error: "Email is already in use" });
    }
    const newUser = new User({
      name,
      email,
      password,
      age,
      city,
      diseases,
      interests
    });

    await newUser.save();
    const token = signToken(newUser);
    res.status(200).json({ token });
  },

  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  loggedIn: async (req, res, next) => {
    res.json({ user: req.user.email });
  }
};
