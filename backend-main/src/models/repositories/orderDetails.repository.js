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

const getDataTime = (value) => {
  return value.split(":");
};

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
const findOrderDetailsByTime = async ({
  startTime,
  endTime,
  date,
  footballId,
  notIns = [],
}) => {
  console.log(`query `, { startTime, endTime, date });

  const fStartTime = formatDateInsert(
    `${date} ${startTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const fEndTime = formatDateInsert(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");
  console.log({ fStartTime, fEndTime, date: date });

  const statusCondition = notIns.length ? { status: { $nin: notIns } } : {};
  const football = footballId ? { football: footballId } : {};

  const response = await orderDetailsModel
    .find({
      ...{
        $or: [
          {
            $and: [
              { startTime: { $lte: fStartTime } },
              { endTime: { $gt: fStartTime } },
            ],
          },
          {
            $and: [
              { startTime: { $lt: fEndTime } },
              { endTime: { $gte: fEndTime } },
            ],
          },
          {
            $and: [
              { startTime: { $gte: fStartTime } },
              { endTime: { $lte: fEndTime } },
            ],
          },
        ],
        date: Array.isArray(date) ? date.map((t) => toDate(t)) : toDate(date),
        ...statusCondition,
        ...football,
      },
    })
    .sort({ date: "asc" })
    .lean();

  if (!response.length) return [];

  // Format string to ['MM', 'mm'] ex: string 10:00 -> ['10', '00'] -> get element 0 -> 10
  const getEndTime = +getDataTime(endTime)[0];

  const newResponse = response.filter((row) => {
    let _endTime = formatDate(row.endTime, "HH:mm");
    _endTime = +getDataTime(_endTime)[0];

    if (_endTime <= getEndTime) return true;
    return false;
  });

  return mapperData(response);
};

const findOrderDetailsByUser = async ({
  user,
  football,
  startTime,
  endTime,
  date,
}) => {
  const fStartTime = formatDateInsert(
    `${date} ${startTime}`,
    "YYYY-MM-DD HH:mm"
  );
  const fEndTime = formatDateInsert(`${date} ${endTime}`, "YYYY-MM-DD HH:mm");

  console.log({ fStartTime, fEndTime });

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

  console.log(response);

  return response;
};

const updateOrderDetails = async (id, data) => {
  const updated = await orderDetailsModel.findByIdAndUpdate(id, data, {
    new: true,
  });
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
