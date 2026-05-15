const {Router} = require('express');
const authMiddleware = require("../middleware/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const transactionRoutes = Router()




// POST /api/transaction/
// --create new transaction
transactionRoutes.post("/", authMiddleware.authMiddleware, transactionController.createTransaction)


/**
 * - POST /api/transactions/systen/initail-funds
 * - create initail funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds", authMiddleware.authMiddleware, transactionController.createInitialFundsTransaction)


module.exports = transactionRoutes;
