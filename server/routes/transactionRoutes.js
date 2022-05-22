const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const apiKeyValidation = require("../middleware/apiKeyValidation");
const tokenValidation = require("../middleware/tokenValidation");

router.post("/:accountId/transactions", apiKeyValidation.validateApiKey, transactionController.createTransaction);

router.get("/:accountId/transactions", tokenValidation.validateToken, transactionController.getTransactions);

router.put(
  "/:accountId/transactions/:transactionId",
  tokenValidation.validateToken,
  transactionController.updateTransaction
);

module.exports = router;
