const Jwt = require("../services/JwtService");
require("dotenv").config();

module.exports = async function (req, res, next) {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.error(401, { message: "Access denied" });
    }
    const token = authorization.split(" ")[1];
    if (!token) {
      return res.error(401, { message: "Access denied token not found" });
    }
    const decodedData = await Jwt.verifyAccess(token);

    if (!decodedData) {
      return res.error(401, { message: "Access denied" });
    }

    req.admin = decodedData;

    if (!decodedData.is_admin) {
      return res.error(401, { message: "Access denied! You are not admin" });
    }

    next();
  } catch (error) {
    res.error(400, { message: error.message });
  }
};
