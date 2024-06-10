"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const footballController = require("../../controllers/football.controller");
const { upload } = require("../../utils/upload");

const router = Router();

router
  .route("/")
  .get(asyncHandler(footballController.getAllFootball))
  .post(
    upload.fields([{ name: "thumbNail", maxCount: 1 }, { name: "images" }]),
    asyncHandler(footballController.createFootball)
  );

router
  .route("/:id")
  .get(asyncHandler(footballController.getFootballById))
  .patch(
    upload.fields([{ name: "thumbNail", maxCount: 1 }, { name: "images" }]),
    asyncHandler(footballController.updateFootball)
  )
  .delete(asyncHandler(footballController.deleteFootballId));

module.exports = router;
