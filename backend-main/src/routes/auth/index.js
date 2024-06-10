"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const authController = require("../../controllers/auth.controller");
const { authentication } = require("../../auth/authUtils");

const router = Router();

router.post("/sign-up", asyncHandler(authController.signUp));
router.post("/login", asyncHandler(authController.signIn));

// authentication
router.use(asyncHandler(authentication));

router.get("/current-user", asyncHandler(authController.getCurrentUserSignIn));
router.post("/refresh-token", asyncHandler(authController.refreshToken));
router.post("/sign-out", asyncHandler(authController.logout));

module.exports = router;
