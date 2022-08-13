const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  categoryID: {
    type: String,
    required: [true, "Please provide category ID"],
    unique: true,
  },
  name: {
    type: String,
    required: [true, "Please provide category name"],
  },
});

module.exports = mongoose.model("Category", CategorySchema);
