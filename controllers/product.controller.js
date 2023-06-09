const ApiError = require("../errors/ApiError");
const Products = require("../models/Product");
const path = require("path");

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
    const product = await Products.create({ ...req.body, image: req.photo });

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
    const data = { ...req.body };

    if (req.photo) {
      data.image = req.photo;
    }

    const product = await Products.findByIdAndUpdate(req.params.id, data, {
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

async function getProductImage(req, res) {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return ApiError.notFound(res, { friendlyMsg: "Not Found" });
    }

    if (!product.image) {
      return ApiError.notFound(res, { friendlyMsg: "Image Not Found" });
    }

    const imageUrl =
      path.join(__dirname, "..") + "/public/images/" + product.image;

    res.sendFile(imageUrl);
  } catch (error) {
    ApiError.internal(res, {
      message: error,
      friendlyMsg: "Server Error",
    });
  }
}

async function filterProduct(req, res) {
  try {
    const { dateFrom, dateTo, name, cheaper, expensive } = req.query;
    const page = +req.query.page || 1;
    const itemsPerPage = 10;
    const query = {};
    const sortQuery = {};

    if (name) {
      query.name = {
        $regex: ".*" + name + ".*",
        $options: "i",
      };
    }

    if (dateFrom && dateTo) {
      query.createdAt = {
        $gte: new Date(dateFrom),
        $lt: new Date(dateTo),
      };
    }

    if (cheaper) {
      sortQuery.price = "asc";
    }

    if (expensive) {
      sortQuery.price = "desc";
    }

    const products = await Products.find(query)
      .sort(sortQuery)
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const totalCount = await Products.countDocuments(query).exec();

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

module.exports = {
  getAll,
  getByID,
  createProduct,
  updateProduct,
  removeProduct,
  getProductImage,
  filterProduct,
};
