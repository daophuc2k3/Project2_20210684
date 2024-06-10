"use strict";

const OrderService = require("../services/order.service");
const { BadRequestError } = require("../utils/error.response");
const { Created, Ok } = require("../utils/success.response");

class OrderController {
  createOrder = async (req, res) => {
    const data = req.body;

    if (
      !data.user ||
      !data.football ||
      !data.phoneNumber ||
      !data.type ||
      !data.startTime ||
      !data.endTime
    ) {
      throw new BadRequestError(
        `Missing \`user\`, \`football\`, \`phoneNumber\`, \`type\`, \`startTime\`, \`endTime\``
      );
    }

    return new Created({
      message: "Create order successfully",
      metadata: await OrderService.createOrder(data),
    }).send(res);
  };

  getAllOrder = async (req, res) => {
    const data = req.query;

    const { pagination, response } = await OrderService.getAllOrder(data);

    return new Ok({
      message: "Get all order successfully",
      metadata: response,
      options: pagination,
    }).send(res);
  };

  getOrderDetailsByTime = async (req, res) => {
    const data = req.query;

    if (!data.startTime || !data.endTime || !data.date) {
      throw new BadRequestError(`Missing \`startTime\`, \`endTime\`, \`date\``);
    }

    const response = await OrderService.getFootballNotInOrder(data);

    return new Ok({
      message: "Get all order details by time successfully",
      metadata: response,
      options: {},
    }).send(res);
  };

  filterDatesByTime = async (req, res) => {
    const data = req.query;

    if (!data.startTime || !data.endTime || !data.date || !data.footballId) {
      throw new BadRequestError(`Missing \`startTime\`, \`endTime\`, \`date\`, \`footballId\``);
    }

    const response = await OrderService.filterDatesByTime(data);

    return new Ok({
      message: "Get filter dates by time successfully",
      metadata: response,
      options: {},
    }).send(res);
  };

  changeStatus = async (req, res) => {
    const orderDetailsId = req.params.orderDetailsId;

    return new Ok({
      message: "Change status successfully",
      metadata: await OrderService.changeStatus(orderDetailsId),
    }).send(res);
  };

  updateOrderDetails = async (req, res) => {
    const orderDetailsId = req.params.orderDetailsId;
    const data = req.body;

    return new Ok({
      message: "Update order details successfully",
      metadata: await OrderService.updateOrderDetails(orderDetailsId, data),
    }).send(res);
  };

  cancelOrderDetails = async (req, res) => {
    const orderDetailsId = req.params.orderDetailsId;

    return new Ok({
      message: "Cancel order details successfully",
      metadata: await OrderService.cancelOrderDetails(orderDetailsId),
    }).send(res);
  };
}

module.exports = new OrderController();
