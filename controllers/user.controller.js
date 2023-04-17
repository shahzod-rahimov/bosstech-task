const User = require("../models/User");
const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");

async function getAll(req, res) {
  try {
    const users = await User.find({});

    if (!users.length) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, users);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function getByID(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function createUser(req, res) {
  try {
    const { phone_number, email } = req.body;
    const isPhoneExists = await User.findOne({ phone_number });

    if (isPhoneExists) {
      return ApiError.error(res, {
        friendlyMsg: "Phone number already exists",
      });
    }

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      return ApiError.error(res, {
        friendlyMsg: "Email already exists",
      });
    }
    const password = await bcrypt.hash(req.body.password, 7);

    const user = await User.create({ ...req.body, password });

    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function updateUser(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!user) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function removeUser(req, res) {
  try {
    const user = await User.findByIdAndRemove(req.params.id);

    if (!user) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, user);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

module.exports = { getAll, getByID, createUser, updateUser, removeUser };
