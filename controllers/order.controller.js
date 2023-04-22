const Order = require("../models/Order");
const User = require("../models/User");
const ApiError = require("../errors/ApiError");
const MailService = require("../services/MailService");

async function getAll(req, res) {
  try {
    const page = +req.query.page || 1;
    const itemsPerPage = 10;

    const products = await Order.find()
      .sort({ createdAt: "desc" })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .populate({ path: "user_id", select: "full_name email phone_number" })
      .populate({ path: "admin_id", select: "full_name email" })
      .populate({
        path: "products",
        populate: { path: "product_id" },
      });

    const totalCount = await Order.countDocuments().exec();

    res.ok(200, {
      records: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        totalCount,
      },
    });
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function getByID(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate({ path: "user_id", select: "full_name email phone_number" })
      .populate({ path: "admin_id", select: "full_name email" })
      .populate({
        path: "products",
        populate: { path: "product_id" },
      });

    if (!order) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, order);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function createOrder(req, res) {
  try {
    const order = new Order(req.body);

    await order.save();

    const user = await User.findById(order.user_id);

    await MailService.sendNotifWhenCreateOrder(
      user.email,
      statusToText(order.status),
      order.createdAt
    );

    const data = await Order.findById(order._id)
      .populate({ path: "user_id", select: "full_name email phone_number" })
      .populate({ path: "admin_id", select: "full_name email" })
      .populate({
        path: "products",
        populate: { path: "product_id" },
      });

    res.ok(200, data);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function updateOrder(req, res) {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!order) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, order);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function deleteOrder(req, res) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, order);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function changeStatus(req, res) {
  try {
    const { id, status } = req.query;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    const user = await User.findById(order.user_id);

    if (!order) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    await MailService.sendNotifWhenChangeStatus(
      user.email,
      statusToText(order.status),
      order.updatedAt
    );

    res.ok(200, order);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

function statusToText(status) {
  if (status == 1) {
    return "Pending";
  } else if (status == 2) {
    return "Processing";
  } else if (status == 3) {
    return "Shipped";
  } else if (status == 4) {
    return "Delivered";
  }
}

async function filterOrder(req, res) {
  try {
    const { user, admin, status, dateFrom, dateTo } = req.query;
    const query = {};
    const page = +req.query.page || 1;
    const itemsPerPage = 10;

    if (user) {
      query.user_id = user;
    }

    if (admin) {
      query.admin_id = admin;
    }

    if (status) {
      query.status = status;
    }

    if (dateFrom && dateTo) {
      query.createdAt = {
        $gte: new Date(dateFrom),
        $lt: new Date(dateTo),
      };
    }

    const order = await Order.find(query)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCount = await Order.countDocuments(query).exec();

    res.ok(200, {
      records: order,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / itemsPerPage),
        totalCount,
      },
    });
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
  createOrder,
  updateOrder,
  deleteOrder,
  changeStatus,
  filterOrder,
};
