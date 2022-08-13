const { Asset } = require("../models");
const { StatusCodes } = require("http-status-codes");
const { CustomError, NotFoundError } = require("../errors");

const createAsset = async (req, res) => {
  const { userID } = req.query;
  const { assetID } = req.body;
  const asset = await Asset.findOne({ assetID });
  if (asset) {
    throw new CustomError(
      `Asset with ${assetID} already exists!`,
      StatusCodes.CONFLICT
    );
  }
  const newAsset = await Asset.create({ ...req.body, createdBy: userID });
  if (!newAsset) {
    throw new CustomError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Something went wrong!"
    );
  }
  res.status(StatusCodes.CREATED).json({ msg: `Asset is created succesfully` });
};

const getAssetDetails = async (req, res) => {
  const { assetID } = req.params;
  const asset = await Asset.findOne({ assetID }).populate("categoryID");
  if (!asset) {
    throw new NotFoundError(`Asset with ID: ${assetID} is not found`);
  }
  res.status(StatusCodes.OK).json({ asset });
};

const getAllAssets = async (req, res) => {
  const assets = await Asset.find().populate("categoryID");
  if (!assets || assets.length === 0) {
    throw new NotFoundError("No assets available");
  }
  res.status(StatusCodes.OK).json({ assets });
};

const updateAsset = async (req, res) => {
  const { assetID } = req.params;
  const asset = await Asset.findOneAndUpdate({ assetID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!asset) {
    throw new NotFoundError(`Asset with ID: ${assetID} is not found`);
  }
  res.status(StatusCodes.OK).json({ msg: `Asset is updated succesfully` });
};

const deleteAsset = async (req, res) => {
  const { assetID } = req.params;
  const asset = await Asset.findOneAndDelete({ assetID });
  if (!asset) {
    throw new NotFoundError(`Asset with ID: ${assetID} is not found`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: `Asset with ID: ${assetID} is deleted successfully` });
};

module.exports = {
  createAsset,
  getAssetDetails,
  getAllAssets,
  updateAsset,
  deleteAsset,
};
