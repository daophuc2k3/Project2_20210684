"use strict";

const { Router } = require("express");
const asyncHandler = require("../../utils/asyncHandler");
const orderController = require("../../controllers/order.controller");
const { authentication } = require("../../auth/authUtils");

const router = Router();

// authentication
// router.use(asyncHandler(authentication));

router
  .route("/")
  .get(asyncHandler(orderController.getAllOrder))
  .post(asyncHandler(orderController.createOrder));

router.get("/order-details-by-time", asyncHandler(orderController.getOrderDetailsByTime));
router.get("/filter-date-by-time", asyncHandler(orderController.filterDatesByTime));

router.post("/change-status/:orderDetailsId", asyncHandler(orderController.changeStatus));
router.post(
  "/update-order-details/:orderDetailsId",
  asyncHandler(orderController.updateOrderDetails)
);

// router
//   .route("/:id")
//   .get(asyncHandler(productController.getProductById))
//   .patch(upload.single("image"), asyncHandler(productController.updateProduct))
//   .delete(asyncHandler(productController.deleteProductId));

module.exports = router;
