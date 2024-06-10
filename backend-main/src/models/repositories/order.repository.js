"use strict";

const { parserParams } = require("../../helpers/filterData.helper");
const orderModel = require("../order.model");
const { findOrderDetailsByOrderId } = require("./orderDetails.repository");

const addOrder = async ({ user, phoneNumber, type }) => {
  const orderAdded = await orderModel.create({ user, phoneNumber, type });
  return orderAdded;
};

const findOrder = async (filters = {}) => {
  const { options, limit, page, skip, sortBy } = parserParams(filters);

  const orders = await orderModel
    .find(options)
    .populate("user", "displayName _id")
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .lean();

  const total = await orderModel.countDocuments(options);

  const results = await Promise.all(
    orders.map(async (order) => {
      const details = await findOrderDetailsByOrderId(order._id);
      return {
        ...order,
        details,
      };
    })
  );

  return {
    response: results,
    pagination: {
      page,
      limit,
      totalRows: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  addOrder,
  findOrder,
};
