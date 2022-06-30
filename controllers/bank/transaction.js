const createHttpError = require("http-errors");
const BankUser = require("../../models/bank/BankUser");
const Transaction = require("../../models/bank/Transactions");

exports.putTransaction = async (req, res, next) => {
  const fromInfo = req.body.from;
  const toInfo = req.body.to;
  const products = req.body.products;
  try {
    const from = await BankUser.findOne({
      bankAccountNo: fromInfo.bankAccountNo,
      bankAccountName: fromInfo.bankAccountName,
      bankAccountToken: fromInfo.bankAccountToken,
    });
    const to = await BankUser.findOne({
      bankAccountNo: toInfo.bankAccountNo,
      bankAccountName: toInfo.bankAccountName,
      bankAccountToken: toInfo.bankAccountToken,
    });

    if (!from || !to) {
      console.log("from", from);
      console.log("to", to);
      return next(createHttpError(500, "Bank user of transaction not found."));
    }

    const totalAmount = products.reduce((total, currVal) => {
      return total + +currVal.price * +currVal?.quantity;
    }, 0);

    const transaction = new Transaction({
      from: from._id,
      to: to._id,
      products: products,
      totalAmount: totalAmount,
    });

    if (from.balance < totalAmount) {
      return next(createHttpError(500, "Not sufficient balance"));
    }
    from.balance -= totalAmount;
    to.balance += totalAmount;

    await from.save();
    await to.save();
    await transaction.save();

    res.status(201).json({
      message: "Transaction successful",
      totalAmount: totalAmount,
      products: products,
      from: from.bankAccountName,
      to: to.bankAccountName,
      transactionId: transaction._id,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getTransaction = async (req, res, next) => {
  const transactionId = req.params.transactionId;
  try {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return next(createHttpError(500, "Transaction not found"));
    }
    res.status(200).json({
      message: "Transaction fetch successfull",
      transaction: transaction,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
