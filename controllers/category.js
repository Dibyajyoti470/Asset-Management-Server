const { Category } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { CustomError } = require("../errors");

const createCategory = async (req, res) => {
  const { categoryID } = req.body;
  const category = await Category.findOne({ categoryID });
  if (category) {
    throw new CustomError(
      `Category with ${categoryID} already exists!`,
      StatusCodes.CONFLICT
    );
  }
  const newCategory = await Category.create({ ...req.body });
  if (!newCategory) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong!"
    );
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: `Category is created succesfully` });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  if (!categories || categories.length === 0) {
    throw new NotFoundError("No categories available");
  }
  res.status(StatusCodes.OK).json({ categories });
};

module.exports = {
  createCategory,
  getAllCategories,
};
