const ApiError = require("../errors/ApiError");
const Products = require("../models/Product");

async function getAll(req, res) {
  try {
    const page = +req.query.page || 1;
    const itemsPerPage = 10;

    const products = await Products.find()
      .sort({ createdAt: "desc" })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCount = await Products.countDocuments().exec();

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
    const product = await Products.findById(req.params.id);

    if (!product) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, product);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function createProduct(req, res) {
  try {
    const product = await Products.create(req.body);

    res.ok(201, product);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function updateProduct(req, res) {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, product);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function removeProduct(req, res) {
  try {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    res.ok(200, product);
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
  createProduct,
  updateProduct,
  removeProduct,
};
