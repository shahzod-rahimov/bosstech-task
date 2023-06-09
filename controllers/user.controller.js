const User = require("../models/User");
const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("../services/JwtService");
const path = require("path");
require("dotenv").config();

async function getAll(req, res) {
  try {
    const page = +req.query.page || 1;
    const itemsPerPage = 10;

    const users = await User.find({})
      .sort({ createdAt: "desc" })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCount = await User.countDocuments().exec();

    if (!users.length) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, {
      records: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        totalCount,
      },
    });
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
    const data = { ...req.body };

    if (req.photo) {
      data.image = req.photo;
    }

    const user = await User.findByIdAndUpdate(req.params.id, data, {
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

async function signup(req, res) {
  try {
    const { phone_number, email } = req.body;
    const isPhoneExists = await User.findOne({ phone_number });

    if (isPhoneExists) {
      return ApiError.error(res, {
        friendlyMsg: "Already registered",
      });
    }

    const isEmailExists = await User.findOne({ email });

    if (isEmailExists) {
      return ApiError.error(res, {
        friendlyMsg: "Already registered",
      });
    }
    const password = await bcrypt.hash(req.body.password, 7);

    const user = await User.create({ ...req.body, password, image: req.photo });

    const payload = {
      id: user._id,
    };

    const tokens = jwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_MS,
      httpOnly: true,
    });

    res.ok(200, { ...tokens, user: payload });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return ApiError.error(res, {
        friendlyMsg: "Email or Password wrong",
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return ApiError.error(res, {
        friendlyMsg: "Email or Password wrong",
      });
    }

    const payload = {
      id: user._id,
    };

    const tokens = jwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_MS,
      httpOnly: true,
    });

    res.ok(200, tokens);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function logout(req, res) {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return ApiError.error(res, {
        friendlyMsg: "Token not found",
      });
    }
    const user = await User.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );

    if (!user) {
      return ApiError.error(res, {
        friendlyMsg: "Token not found",
      });
    }

    res.clearCookie("refreshToken");

    res.ok(200, { friendlyMsg: "Successfully logouted" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Serverda xatolik",
    });
  }
}

async function getUserImage(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    if (!user.image) {
      return ApiError.notFound(res, { friendlyMsg: "Image Not Found" });
    }

    const imageUrl =
      path.join(__dirname, "..") + "/public/images/" + user.image;

    res.sendFile(imageUrl);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

module.exports = {
  getAll,
  getByID,
  createUser,
  updateUser,
  removeUser,
  signup,
  signin,
  logout,
  getUserImage,
};
