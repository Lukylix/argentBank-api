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
      result.populate("categoryId"),
      account.update({
        $set: { amount: serviceData.body.amount + account.amount },
        $inc: { transactions: 1 },
      }),
    ]);
    result = result.toObject();
    const transaction = { ...result, category: result.categoryId };
    delete transaction.categoryId;
    return transaction;
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};

module.exports.getTransactions = async (serviceData) => {
  try {
    const itemsPerPage = 20;
    const page = parseInt(serviceData?.query?.page) || 1;
    const { accountId } = serviceData.params;
    const jwtToken = serviceData.headers.authorization.split("Bearer")[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);

    const account = await Account.findOne({ _id: accountId, userId: decodedJwtToken.id });
    if (!account) throw new Error("Account not found!");

    const [transactions, count] = await Promise.all([
      Transaction.find({ accountId: accountId, userId: decodedJwtToken.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .populate("categoryId")
        .allowDiskUse(),
      Transaction.find({ accountId: accountId, userId: decodedJwtToken.id }).countDocuments(),
    ]);
    if (!transactions) throw new Error("Transactions not found!");

    return {
      total: count,
      page,
      totalPage: Math.ceil(count / itemsPerPage),
      transactions: transactions.map((transaction) => {
        transaction = transaction.toObject();
        transaction = { ...transaction, category: transaction.categoryId };
        delete transaction.categoryId;
        return transaction;
      }),
    };
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
    let transactionObject = transaction.toObject();
    transactionObject = { ...transactionObject, category: transactionObject.categoryId };
    delete transactionObject.categoryId;
    return transactionObject;
  } catch (error) {
    console.error("Error in transactionService.js", error);
    throw new Error(error);
  }
};
