const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token: user.createJWT() });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await foundUser.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = foundUser.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: foundUser.name }, token });
};

module.exports = {
  register,
  login,
};
