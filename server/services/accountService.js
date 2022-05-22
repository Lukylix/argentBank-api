const Account = require("../database/models/accountModel");
const User = require("../database/models/userModel");
const jwt = require("jsonwebtoken");

module.exports.createAccount = async (serviceData) => {
  try {
    const user = await User.findById(serviceData.body.userId);
    if (!user) throw new Error("User not found!");

    const newAccount = new Account({
      userId: serviceData.userId,
      type: serviceData.type,
      // ammount: serviceData.ammount,
      // transactions: serviceData.transactions,
    });

    let result = await newAccount.save();

    return result.toObject();
  } catch (error) {
    console.error("Error in accountService.js", error);
    throw new Error(error);
  }
};

module.exports.getAccounts = async (serviceData) => {
  try {
    const jwtToken = serviceData.headers.authorization.split("Bearer")[1].trim();
    const decodedJwtToken = jwt.decode(jwtToken);

    const accounts = await Account.find({ userId: decodedJwtToken.id });
    if (!accounts) throw new Error("Accounts not found!");

    return accounts.map((account) => account.toObject());
  } catch (error) {
    console.error("Error in accountService.js", error);
    throw new Error(error);
  }
};
