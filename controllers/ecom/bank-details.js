const createHttpError = require("http-errors");
const User = require("../../models/ecom/Users");

exports.postBankInfo = async (req, res, next) => {
  try {
    const bankAccountNo = req.body.bankAccountNo || "";
    const bankAccountName = req.body.bankAccountName || "";
    const bankAccountToken = req.body.bankAccountToken || "";
    const user = await User.findById(req.userId);
    if (!user) {
      return next(createHttpError(500, "Something went wrong!"));
    }
    user.bankAccountNo = bankAccountNo;
    user.bankAccountName = bankAccountName;
    user.bankAccountToken = bankAccountToken;

    await user.save();

    res.status(200).json({
      message: "Bank information updated",
      userId: req.userId,
      bankAccountNo: bankAccountNo,
      bankAccountName: bankAccountName,
      bankAccountToken: bankAccountToken,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
