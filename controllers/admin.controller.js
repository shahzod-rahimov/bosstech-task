const Admin = require("../models/Admin");
const ApiError = require("../errors/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("../services/JwtService");
require("dotenv").config();

async function getAll(req, res) {
  try {
    const page = +req.query.page || 1;
    const itemsPerPage = 10;

    const admins = await Admin.find({})
      .select("-password")
      .sort({ createdAt: "desc" })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCount = await Admin.countDocuments().exec();

    if (!admins.length) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, {
      records: admins,
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
    const admin = await Admin.findById(req.params.id).select("-password");

    if (!admin) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, admin);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function updateAdmin(req, res) {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-password");

    if (!admin) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, admin);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function removeAdmin(req, res) {
  try {
    const admin = await Admin.findByIdAndRemove(req.params.id);

    if (!admin) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, { friendlyMsg: "Admin removed successfully" });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server error",
    });
  }
}

async function signup(req, res) {
  try {
    const { email } = req.body;

    const isEmailExists = await Admin.findOne({ email });

    if (isEmailExists) {
      return ApiError.error(res, {
        friendlyMsg: "Already registered",
      });
    }
    const password = await bcrypt.hash(req.body.password, 7);

    const admin = await Admin.create({ ...req.body, password });

    const payload = {
      id: admin._id,
      is_admin: admin.is_admin,
    };

    const tokens = jwt.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_MS,
      httpOnly: true,
    });

    res.ok(200, { ...tokens, admin: payload });
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

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return ApiError.error(res, {
        friendlyMsg: "Email or Password wrong",
      });
    }

    const validPassword = bcrypt.compareSync(password, admin.password);

    if (!validPassword) {
      return ApiError.error(res, {
        friendlyMsg: "Email or Password wrong",
      });
    }

    const payload = {
      id: admin._id,
      is_admin: admin.is_admin,
    };

    const tokens = jwt.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      maxAge: process.env.REFRESH_TOKEN_MS,
      httpOnly: true,
    });

    res.ok(200, { tokens, admin: payload });
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
    const admin = await Admin.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );

    if (!admin) {
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

module.exports = {
  getAll,
  getByID,
  updateAdmin,
  removeAdmin,
  signup,
  signin,
  logout,
};
