const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    toObject: {
      transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Category", categorySchema);
