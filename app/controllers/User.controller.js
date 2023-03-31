const handler = require("./handlerFactory");
const User = require("../models/User.model");
const {register} = require("./Authorization");
const { UnAuthenticated } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const catchAsync = require('../utils/catchAsync')


const getMe = catchAsync(async (req, res) => {
  if (!req.user._id) {
    throw new UnAuthenticated("oop you are not allowed to perfom this action");
  }
  const user = await User.findById(req.user._id);

  res.status(StatusCodes.OK).json({ data: user });
});

exports.registerUser = register(User);

const CreateUser = handler.createOne(User);

const UpdateUser = handler.updateOne(User);
const updateMe = handler.updateMe(User);
const DeleteUser = handler.deleteOne(User);

module.exports = {
  CreateUser,
  UpdateUser,
  DeleteUser,
  getMe,
  updateMe,
};
