const transactionService = require("../services/transactionService");

module.exports.createTransaction = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await transactionService.createTransaction(req);
    response.status = 200;
    response.message = "Transaction successfully created";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};

module.exports.getTransactions = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await transactionService.getTransactions(req);
    response.status = 200;
    response.message = "Transactions successfully fetched";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};

module.exports.updateTransaction = async (req, res) => {
  let response = {};
  try {
    const responseFromService = await transactionService.updateTransaction(req);
    response.status = 200;
    response.message = "Transaction successfully updated";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};
