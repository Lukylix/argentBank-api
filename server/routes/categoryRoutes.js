const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const apiKeyValidation = require("../middleware/apiKeyValidation");

router.post("/", apiKeyValidation.validateApiKey, categoryController.createCategory);

router.get("/", categoryController.getCategories);

module.exports = router;
