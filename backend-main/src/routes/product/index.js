"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const productController = require("../../controllers/product.controller");
const { upload } = require("../../utils/upload");

const router = Router();

router
  .route("/")
  .get(asyncHandler(productController.getAllProduct))
  .post(upload.single("image"), asyncHandler(productController.createProduct));

router
  .route("/:id")
  .get(asyncHandler(productController.getProductById))
  .patch(upload.single("image"), asyncHandler(productController.updateProduct))
  .delete(asyncHandler(productController.deleteProductId));

module.exports = router;
