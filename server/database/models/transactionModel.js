const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    ammount: {
      type: Number,
      set: (value) => value.toFixed(2),
    },
    balance: {
      type: Number,
      set: (value) => value.toFixed(2),
    },
    type: String,
    description: String,
    note: String,
  },
  {
    timestamps: true,
    toObject: {
      transform: (doc, ret, options) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
