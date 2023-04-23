const expressWinston = require("express-winston");
const { transports, format } = require("winston");
const { combine, errors, json, metadata, prettyPrint, colorize } = format;

const winstonLogger = expressWinston.logger({
  transports: [
    // new transports.Console(),
    new transports.File({ filename: "logs/logger.log" }),
  ],
  format: combine(json(), metadata(), prettyPrint()),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});

const errLogger = expressWinston.errorLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
  ],
  format: combine(errors({ stack: true }), json(), colorize(), metadata()),
});

module.exports = {
  winstonLogger,
  errLogger,
};
