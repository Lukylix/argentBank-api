const Account = require("../database/models/accountModel");
const Transaction = require("../database/models/transactionModel");
const Category = require("../database/models/categoryModel");
const jwt = require("jsonwebtoken");

module.exports.createTransaction = async (serviceData) => {
  try {
    const { accountId } = serviceData.params;

    const [account, category] = await Promise.all([
      Account.findOne({ _id: accountId, userId: serviceData.body.userId }),
      Category.findById(serviceData.body.categoryId),
    ]);
    if (!account) throw new Error("Account not found!");
    if (!category) throw new Error("Category not found!");

    const newTransaction = new Transaction({
      accountId: accountId,
      userId: serviceData.body.userId,
      categoryId: serviceData.body.categoryId,
      amount: serviceData.body.amount,
      balance: account.amount + serviceData.body.amount,
      type: serviceData.body.type,
      description: serviceData.body.description,
    });

    let result = await newTransaction.save();
    await Promise.all([
      result.populate("categoryId").execPopulate(),
      account.update({
        $set: { amount: serviceData.body.amount + account.amount },
        $inc: { transactions: 1 },
      }),
    ]);

    return result.toObject();
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};

module.exports.getTransactions = async (serviceData) => {
  try {
    const { accountId } = serviceData.params;
    const jwtToken = serviceData.headers.authorization.split("Bearer")[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);
    console.log(accountId, decodedJwtToken.id);

    const account = await Account.findOne({ _id: accountId, userId: decodedJwtToken.id });
    if (!account) throw new Error("Account not found!");

    const transactions = await Transaction.find({ accountId: accountId, userId: decodedJwtToken.id })
      .populate("categoryId")
      .sort({ createdAt: -1 })
      .allowDiskUse();
    if (!transactions) throw new Error("Transactions not found!");

    return transactions.map((transaction) => transaction.toObject());
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};

module.exports.updateTransaction = async (serviceData) => {
  try {
    const { accountId, transactionId } = serviceData.params;
    const jwtToken = serviceData.headers.authorization.split("Bearer")[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);

    const account = await Account.findOne({ _id: accountId, userId: decodedJwtToken.id });
    if (!account) throw new Error("Account not found!");

    let transactionUpdate = {};
    if (serviceData.body?.categoryId) {
      const category = await Category.findById(serviceData.body.categoryId);
      if (!category) throw new Error("Category not found!");
      transactionUpdate.categoryId = serviceData.body.categoryId;
    }
    if (serviceData.body?.note) transactionUpdate.note = serviceData.body.note;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        accountId: accountId,
        userId: decodedJwtToken.id,
      },
      transactionUpdate,
      { new: true }
    ).populate("categoryId");
    if (!transaction) throw new Error("Transaction not found!");

    return transaction.toObject();
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};
