const { default: axios } = require("axios");
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

    const response = await axios.post(
      "http://localhost:8080/bank/api/user/update-user",
      {
        userId: req.userId,
        bankAccountNo: bankAccountNo,
        bankAccountName: bankAccountName,
        bankAccountToken: bankAccountToken,
      }
    );
    if (response.status !== 201) {
      next(createHttpError(500, "Somethign went wrong calling bank API"));
    }
    res.status(200).json({
      message: "Bank information updated",
      bankResponse: {
        status: response.status,
        data: response.data,
      },
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
