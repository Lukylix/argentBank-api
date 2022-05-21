const categoryService = require("../services/categoryService");

module.exports.createCategory = async (req, res) => {
  let response = {};

  try {
    const responseFromService = await categoryService.createCategory(req.body);
    response.status = 200;
    response.message = "Category successfully created";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};

module.exports.getCategories = async (req, res) => {
  let response = {};

  try {
    const responseFromService = await categoryService.getCategories();
    response.status = 200;
    response.message = "Successfully got categories";
    response.body = responseFromService;
  } catch (error) {
    console.error("Something went wrong in userController.js", error);
    response.status = 400;
    response.message = error.message;
  }

  return res.status(response.status).send(response);
};
