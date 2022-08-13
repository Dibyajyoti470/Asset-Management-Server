const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  assetID: {
    type: String,
    required: [true, "Please provide asset ID"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide asset name"],
  },
  assignedAt: {
    type: Date,
    required: [true, "Please provide date of assignment"],
  },
  assignedTo: {
    type: String,
    required: [true, "Please provide the name of assignee"],
  },
  status: {
    type: String,
    required: [true, "Please provide status"],
  },
  notes: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "Please provide asset category"],
  },
  categoryID: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [
      true,
      "Please provide the person name who has created the record",
    ],
  },
});

module.exports = mongoose.model("Asset", AssetSchema);
