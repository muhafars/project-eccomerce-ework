const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async function (req, res, next) {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const localStrategy = async function (email, password, done) {
  try {
    let user = await User.findOne({ email }).select("-__v -createdAt -updateAt -cartItems -token");
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done(null);
};

const login = async function (req, res, next) {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    console.log(err);
    if (!user) return res.json({ error: 1, message: err.message });
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
    res.json({
      message: "Login Successfully",
      user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async function (req, res, next) {
  let token = getToken(req);
  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token: token } },
    { userFindAndModify: false }
  );
  if (!token || !user) {
    res.json({
      error: 1,
      message: "User Not Found",
    });
  }
  return res.json({
    error: 0,
    message: "LogOut Berhasil",
  });
};

const me = async function (req, res, next) {
  if (!req.user) {
    res.json({
      error: 1,
      message: "You're Not Login or Token Expired",
    });
  }
  return res.json(req.user);
};

module.exports = { register, localStrategy, login, logout, me };
