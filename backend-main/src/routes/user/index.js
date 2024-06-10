"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const userController = require("../../controllers/user.controller");
const { upload } = require("../../utils/upload");

const router = Router();

router.get("/", asyncHandler(userController.getAll));
router.patch("/:id", upload.single("avatar"), asyncHandler(userController.updateUser));

module.exports = router;
