"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const statisticsController = require("../../controllers/statistics.controller");

const router = Router();

router.get("/user-bookings", asyncHandler(statisticsController.userBookings));
router.get(
  "/football-booked",
  asyncHandler(statisticsController.footballBooked)
);
router.get("/revenue", asyncHandler(statisticsController.revenue));

module.exports = router;
