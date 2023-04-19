const Order = require("../models/Order");
const ApiError = require("../errors/ApiError");

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

module.exports = { getAll, getByID, createOrder };
