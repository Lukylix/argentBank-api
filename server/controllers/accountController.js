const accountService = require("../services/accountService");

module.exports.createAccount = async (req, res) => {
  let response = {};

  try {
    const responseFromService = await accountService.createAccount(req.body);
    response.status = 200;
    response.message = "Account successfully created";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};

module.exports.getAccounts = async (req, res) => {
  let response = {};

  try {
    const responseFromService = await accountService.getAccounts(req);
    response.status = 200;
    response.message = "Successfully got accounts";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};
