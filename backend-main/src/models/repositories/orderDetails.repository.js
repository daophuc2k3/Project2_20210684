"use strict";

const { OrderDetailsStatus } = require("../../constants/booking.constant");
const { formatDate, toDate, formatDateInsert } = require("../../utils/common");
const orderDetailsModel = require("../orderDetails.model");

/**
 *
 * @param {{ order, football, startTime, endTime, date } | { order, football, startTime, endTime, date }[]} data
 * @returns
 */
const addOrderDetails = async (data) => {
  const orderDetailsAdded = await orderDetailsModel.create(data);
  return orderDetailsAdded;
};

const mapperData = (response) =>
  response.map((t) => ({
    ...t,
    startTime: formatDate(t.startTime, "HH:mm"),
    endTime: formatDate(t.endTime, "HH:mm"),
    date: formatDate(t.date),
  }));

const findOrderDetailsByOrderId = async (orderId) => {
  const response = await orderDetailsModel
    .find({ order: orderId })
    .populate({
      path: "football",
      populate: {
        path: "category",
      },
    })
    .lean();

  if (!response.length) return [];

  return mapperData(response);
};

/**
 * @description startTime, endTime format `HH:mm` - date format `YYYY-MM-DD`
 * @param {{ startTime: string, endTime: string, date: string | string[], footballId: string, notIns: string[] }} param0
 * @returns
 */
const findOrderDetailsByTime = async ({ startTime, endTime, date, footballId, notIns = [] }) => {
  // console.log(`query `, { startTime, endTime, date });

  const fStartTime = formatDateInsert(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
  const fEndTime = formatDateInsert(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");
  // console.log({ fStartTime, fEndTime, date: date });

  const statusCondition = notIns.length ? { status: { $nin: notIns } } : {};
  const football = footballId ? { football: footballId } : {};

  const response = await orderDetailsModel
    .find({
      $or: [
        {
          date: Array.isArray(date) ? date.map((t) => toDate(t)) : toDate(date),
          startTime: {
            $gte: fStartTime,
          },
          endTime: {
            $lte: fEndTime,
          },
          ...statusCondition,
          ...football,
        },
        {
          date: Array.isArray(date) ? date.map((t) => toDate(t)) : toDate(date),
          startTime: {
            $gte: fStartTime,
            $lte: fEndTime,
          },
          ...statusCondition,
          ...football,
        },
        {
          date: Array.isArray(date) ? date.map((t) => toDate(t)) : toDate(date),
          endTime: {
            $gte: fStartTime,
            $lte: fEndTime,
          },
          ...statusCondition,
          ...football,
        },
        {
          date: Array.isArray(date) ? date.map((t) => toDate(t)) : toDate(date),
          endTime: {
            $gte: fEndTime,
          },
          startTime: {
            $lte: fEndTime,
          },
          ...statusCondition,
          ...football,
        },
        {
          date: Array.isArray(date) ? date.map((t) => toDate(t)) : toDate(date),
          endTime: {
            $gte: fEndTime,
          },
          ...statusCondition,
          ...football,
        },
      ],
    })
    .sort({ date: "asc" })
    .lean();

  if (!response.length) return [];

  return mapperData(response);
};

const findOrderDetailsByUser = async ({ user, football, startTime, endTime, date }) => {
  const fStartTime = formatDateInsert(`${date} ${startTime}`, "YYYY-MM-DD HH:mm");
  const fEndTime = formatDateInsert(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

  const response = await orderDetailsModel
    .find({
      status: {
        $nin: [OrderDetailsStatus.canceled, OrderDetailsStatus.finished],
      },
      football,
      date: toDate(date),
      startTime: {
        $gte: fStartTime,
      },
      endTime: {
        $lte: fEndTime,
      },
    })
    .populate({
      path: "order",
      match: {
        user,
      },
    });

  return response;
};

const updateOrderDetails = async (id, data) => {
  const updated = await orderDetailsModel.findByIdAndUpdate(id, data);
  return updated;
};

const findOderDetailsById = async (id) => {
  const response = await orderDetailsModel.findById(id).exec();
  return response;
};

module.exports = {
  addOrderDetails,
  findOrderDetailsByOrderId,
  findOrderDetailsByTime,
  findOrderDetailsByUser,
  updateOrderDetails,
  findOderDetailsById,
};
