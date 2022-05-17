const bcrypt = require("bcrypt");
const crypto = require("crypto");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const jwt = require("jsonwebtoken");

const PendingUser = require("../../models/ecom/pendingUsers");
const User = require("../../models/ecom/Users");

const tokenList = {};

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

exports.signup = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const buffer = crypto.randomBytes(32);
    const token = buffer.toString("hex");

    const alreadyPending = await PendingUser.findOne({ email: email });
    let pendingUser;
    if (!alreadyPending) {
      pendingUser = new PendingUser({
        username: username,
        email: email,
        password: hashedPassword,
        token: token,
        tokenTimeout: Date.now() + 3600000,
      });
    } else {
      pendingUser = alreadyPending;
      pendingUser.token = token;
      pendingUser.tokenTimeout = Date.now() + 3600000;
    }

    await pendingUser.save();

    res.status(201).json({
      message: "Signup completed. Check your email for verification",
    });

    emailVerification = {
      to: [
        {
          email: email,
          name: username,
        },
      ],
      templateId: +process.env.SIB_EMAIL_VERIFICATION_TEMPLATE_ID,
      params: {
        FULLNAME: username,
        TOKEN: "http://localhost:8080" + "/ecom/api/auth/verification/" + token,
        EMAIL: email,
        SYNERGYURL: process.env.KAIMASU_FRONTEND,
      },
    };

    const data = await apiInstance.sendTransacEmail(emailVerification);
    console.log("Confirmation Sent! Returned data " + JSON.stringify(data));
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getVerfication = async (req, res, next) => {
  const token = req.params.token;

  try {
    const pendingUser = await PendingUser.findOne({
      token: token,
      tokenTimeout: { $gt: Date.now() },
    });

    if (!pendingUser) {
      const error = new Error("Invalid token or token timeout.");
      error.statusCode = 403;
      throw error;
    }

    const user = new User({
      username: pendingUser.username,
      email: pendingUser.email,
      avatar: `https://avatars.dicebear.com/api/${process.env.AVATAR_STYLE}/${pendingUser.username}.svg`,
      password: pendingUser.password,
    });

    await user.save();
    await PendingUser.findOneAndDelete(pendingUser._id);

    res.status(201).redirect(process.env.SYNERGY_FRONTEND + "/login");
    confirmationEmail = {
      to: [
        {
          email: user.email,
          name: user.username,
        },
      ],
      templateId: +process.env.SIB_ACCOUNT_CONFIRMATION,
      params: {
        FULLNAME: user.username,
        EMAIL: user.email,
        LOGIN: process.env.SYNERGY_FRONTEND + "/login",
        SYNERGYURL: process.env.SYNERGY_FRONTEND,
      },
    };
    const data = await apiInstance.sendTransacEmail(confirmationEmail);
    console.log("Confirmation Sent! Returned data " + JSON.stringify(data));

    console.log("Email Verified!");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
