const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const BankUser = require("../../models/bank/BankUser");

exports.postUserDetail = async (req, res, next) => {
  const bankAccountNo = req.body.bankAccountNo || "";
  const bankAccountName = req.body.bankAccountName || "";
  const bankAccountToken = req.body.bankAccountToken || "";
  const userId = req.body.userId;
  try {
    if (!userId) {
      return next(createHttpError(500, "UserId not valid"));
    }
    let bankUser = await BankUser.findOne({
      userId: mongoose.Types.ObjectId(userId),
    });
    if (!bankUser) {
      bankUser = new BankUser({
        userId: mongoose.Types.ObjectId(userId),
      });
    }
    bankUser.bankAccountNo = bankAccountNo;
    bankUser.bankAccountName = bankAccountName;
    bankUser.bankAccountToken = bankAccountToken;

    await bankUser.save();
    res.status(201).json({
      message: "User detail on bank updated",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
