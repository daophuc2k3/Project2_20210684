"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const categoryController = require("../../controllers/category.controller");

const router = Router();

router
  .route("/")
  .get(asyncHandler(categoryController.getAllCategory))
  .post(asyncHandler(categoryController.createCategory));

router
  .route("/:id")
  .get(asyncHandler(categoryController.getCategoryById))
  .patch(asyncHandler(categoryController.updateCategory))
  .delete(asyncHandler(categoryController.deleteCategoryId));

module.exports = router;
