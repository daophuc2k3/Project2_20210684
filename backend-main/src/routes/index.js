"use strict";

const { Router } = require("express");

const router = Router();

router.use("/api/v1/auth", require("./auth"));
router.use("/api/v1/user", require("./user"));
router.use("/api/v1/category", require("./category"));
router.use("/api/v1/football", require("./football"));
router.use("/api/v1/product", require("./product"));
router.use("/api/v1/order", require("./order"));

module.exports = router;
