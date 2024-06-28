const messageHelper = require("../utils/messageHelper");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHelper");
const {
  isEmail,
  hashData,
  jwtsign,
  comparehashedData,
} = require("../utils/utils");
const User = require("../model/user");

const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!isEmail(email) || !email) {
      return errorResponse(res, 400, messageHelper.INVALID_EMAIL);
    }

    if (!email || !password) {
      return errorResponse(res, 400, messageHelper.BAD_REQUEST);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, messageHelper.USER_EXIST);
    }

    if (password != confirmPassword) {
      return errorResponse(res, 401, messageHelper.PASSWORD_DONT_MATCH);
    }

    const hashedPassword = await hashData(password);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    successResponse(
      res,
      200,
      messageHelper.USER_CREATED,
      (data = { name, email })
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isEmail(email) || !email) {
      return errorResponse(res, 400, messageHelper.INVALID_EMAIL);
    }

    if (!email || !password) {
      return errorResponse(res, 400, messageHelper.BAD_REQUEST);
    }
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, messageHelper.USER_NOT_EXIST);
    }

    const validPassword = await comparehashedData(password, user.password);
    if (!validPassword) {
      return errorResponse(res, 401, messageHelper.INVALID_PASSWORD);
    }

    const token = await jwtsign(user._id);

    successResponse(
      res,
      200,
      messageHelper.USER_LOGEDIN,
      (data = { user: user.name, token })
    );

  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    return successResponse(res, 200, messageHelper.USER_LOGGED_OUT);
  } catch (error) {
    next(error);
  }
};

module.exports = { login, register, logout };
