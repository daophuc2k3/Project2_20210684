"use strict";

const reasonPhrasesCore = require("../core/reasonPhrases.core");
const statusCodesCore = require("../core/statusCodes.core");
const { unlink } = require("../utils/upload");
const { NotFoundRequestError } = require("../utils/error.response");

const catchResourceNotFound = (__, _, next) => {
  const error = new NotFoundRequestError("Resource not found!");
  return next(error);
};

const catchInternalServerError = (error, req, res, __) => {
  console.log("ERROR:::", error);

  const statusCode = error.status || statusCodesCore.INTERNAL_SERVER_ERROR;
  const message = error.message || reasonPhrasesCore.INTERNAL_SERVER_ERROR;

  if (req.file) {
    unlink(req.file.path, req.file.path);
  }

  if (req.files) {
    const files = req.files;

    if (Array.isArray(files)) {
      files.forEach((file) => {
        unlink(file.path, file.path);
      });
    } else {
      Object.keys(files).forEach((key) => {
        const item = files[key];

        if (Array.isArray(item)) {
          [...item].forEach((t) => {
            unlink(t.path, t.path);
          });
        } else {
          unlink(item.path, item.path);
        }
      });
    }
  }

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: message,
  });
};

module.exports = {
  catchResourceNotFound,
  catchInternalServerError,
};
