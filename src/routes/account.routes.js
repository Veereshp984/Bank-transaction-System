const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountModel = require("../models/account.model");
const accountController = require("../controllers/account.controller")
const router = express.Router()




// POST /api/accounts/
// create a new account
// Protected ROute
router.post("/", authMiddleware.authMiddleware,accountController.createAccountController)


/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/accounts", authMiddleware.authMiddleware, accountController.getUserAccountsController)


/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware, accountController.getAccountBalanceController)





module.exports = router