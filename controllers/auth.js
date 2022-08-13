const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { User, Token } = require("../models");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  CustomError,
} = require("../errors");

const register = async (req, res) => {
  const { username, email } = req.body;
  const existingUser = await User.findOne({ username, email });
  if (existingUser) {
    throw new CustomError("User already exists!", StatusCodes.CONFLICT);
  }
  const newUser = await User.create({ ...req.body });
  console.log(
    `An account with username: ${newUser.username} has been successfully created.`
  );
  res.status(StatusCodes.CREATED).json({
    msg: `Account has been successfully created.`,
  });
};

const login = async (req, res) => {
  const { usernameEmail, password } = req.body;

  if (!usernameEmail || !password) {
    throw new BadRequestError("Please provide username/email and password");
  }

  const user = await User.findOne({
    $or: [
      { username: { $eq: usernameEmail } },
      { email: { $eq: usernameEmail } },
    ],
  });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  console.log(
    `User with id: ${user._id}, name: ${user.username} has been successfully logged in.`
  );
  res.status(StatusCodes.OK).json({
    user: { id: user._id, username: user.username, email: user.email },
    token,
    otp: "123456",
  });
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError(`User with email: ${email} does not exist`);
  }
  const token = await Token.findOne({ userID: user._id });
  if (token) {
    await Token.deleteOne({ _id: token._id });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");
  const salt = await bcrypt.genSalt(10);
  const hashedToken = await bcrypt.hash(resetToken, salt);
  const newToken = await Token.create({
    userID: user._id,
    token: hashedToken,
  });
  if (!newToken) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong, please try again later"
    );
  }
  res.status(StatusCodes.OK).json({ userID: user._id, resetToken });
};

const resetPassword = async (req, res) => {
  const {
    body: { password },
    query: { userID, resetToken },
  } = req;
  console.log(userID, `Incoming token: ${resetToken}`, password);
  const user = await User.findById(userID);
  if (!user) {
    throw new BadRequestError(`User with ID: ${userID} does not exist`);
  }
  const storedResetToken = await Token.findOne({ userID });
  if (!storedResetToken) {
    throw new UnauthenticatedError("Invalid or Reset Token expired");
  }
  console.log(`Stored token: ${storedResetToken.token}`);
  const isMatch = await bcrypt.compare(resetToken, storedResetToken.token);
  if (!isMatch) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  await Token.deleteOne({ _id: storedResetToken._id });
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(password, salt);
  const updatedUser = await User.findOneAndUpdate(
    { _id: userID },
    { password: hashedNewPassword },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedUser) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong!"
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Password has been reset succesfully` });
};

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
};
