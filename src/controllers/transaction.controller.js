const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");
const { default: mongoose } = require("mongoose");
/**
 *  - create a nre transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1.validate request
 * 2.validate idempotecy key
 * 3.check account status
 * 4.derive sender balance from ledger
 * 5.create transaction (PENDING)
 * 6.create DEBIT ledger entry
 * 7.create CREDIT ledger entry
 * 8.mark transaction completed
 * 9.commit mongoDB session
 * 10.send email notification
 */

async function createTransaction(req ,res) {

    /**
     * 1.validate request
     */
    const {fromAccount , toAccount , amount , idempotencyKey} = req.body
   if(!fromAccount || !toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
        message : "toAccount , toAccount , amount and idempotencykey are required"
    })
   }
   const fromUserAccount = await accountModel.findOne({
    _id : fromAccount
   })
   const toUserAccount = await accountModel.findOne({
    _id : toAccount
   })
   if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
        message : "Invalid fromAccount Or toAccount"
    })
   }
   /**
    * 2. validating idempotencykey
    */
   const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey : idempotencyKey
   })
   if(isTransactionAlreadyExists){
        if(isTransactionAlreadyExists.status === "COMPLETED"){
           return res.status(200).json({
            message : "transaction already processed",
            transaction : isTransactionAlreadyExists
            })
        }
   }
   if(isTransactionAlreadyExists === "PENDING"){
    return res.status(200).json({
        message : "Transaction is still processing"
    })
    if(isTransactionAlreadyExists === "FAILED"){
        return res.status(500).json({
            message :" The transaction has Failed , please try again."
        })
    }
    if(isTransactionAlreadyExists === "REVERSED"){
        return res.status(500).json({
            message : "Transaction was reversed, please retry."
        })
    }
   }

   /**
    * 3.check account status
    */
   if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({
        message : "Both fromAccount and toAccount must be ACTIVE to process transaction"
    })
   }

   /**
    * 4.Derive Sender balance from ledger
    */
   const balance = await fromUserAccount.getBalance()
   if(balance < amount){
    return res.status(400).json({
        message : `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount}`
    })
   }
   /**
    * 5.create transaction
    */
const session = await mongoose.startSession()
session.startTransaction()

const transaction = (await transactionModel.create([{
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"

}],{session}))[0]

await transaction.save({session})


const debitLedgerEntry = await ledgerModel.create([{
    account : fromAccount,
    amount : amount,
    transaction : transaction._id,
    type : "DEBIT"
}],{session})

await (() =>{
    return new Promise((resolve) => setTimeout(resolve,15 * 1000))
})()

const creditLedgerEntry = await ledgerModel.create([{
account : toAccount,
amount: amount,
transaction : transaction._id,
type:"CREDIT"
}],{session})

transaction.status = "COMPLETED"
    await transaction.save({session})

    await session.commitTransaction()
    session.endSession()

    /**
     * 10.send email notification
     */
    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)

    return res.status(201).json({
       message : "Transaction completed successfully",
       transaction: transaction 
    })
}

async function createInitialFundsTransaction(req, res){
    const {toAccount , amount , idempotencyKey} = req.body

    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message: "toAccount , amount and idempotency are required"
        })
    }
    const toUserAccount = await accountModel.findOne({
        _id:toAccount,
    })
    if(!toUserAccount){
        return res.status(400).json({
           message : " Invalid Account" 
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user : req.user._id,
        currency : toUserAccount.currency
    })
    if(!fromUserAccount){
        return res.status(400).json({
            message : "System account not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount : fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }
)

    const debitLedgerEntry = await ledgerModel.create([{
        account : fromUserAccount._id,
        amount : amount,
        transaction : transaction._id,
        type : "DEBIT"
    }],{session})
    const creditLedgerEntry = await ledgerModel.create([{
        account : toAccount,
        amount: amount,
        transaction : transaction._id,
        type : "CREDIT"
    }],{session})

    transaction.status = "COMPLETED"
    await transaction.save({session})
    await session.commitTransaction()
    session.endSession()

    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message : "Initial funds transaction completed successfully",
        transaction : transaction
    })
}

module.exports = {
    createTransaction,
    createInitialFundsTransaction
}
