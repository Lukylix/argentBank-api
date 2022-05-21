const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const apiKeyValidation = require("../middleware/apiKeyValidation");
const tokenValidation = require("../middleware/tokenValidation");

router.post("/", apiKeyValidation.validateApiKey, accountController.createAccount);

router.get("/", tokenValidation.validateToken, accountController.getAccounts);

module.exports = router;
