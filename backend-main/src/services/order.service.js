"use strict";

const {
  addOrderDetails,
  findOrderDetailsByTime,
  findOrderDetailsByUser,
  findOderDetailsById,
  updateOrderDetails,
} = require("../models/repositories/orderDetails.repository");
const { addOrder, findOrder } = require("../models/repositories/order.repository");
const {
  InternalServerRequestError,
  ConflictRequestError,
  NotFoundRequestError,
} = require("../utils/error.response");
const {
  BookingTypes,
  OrderDetailsStatus,
  OrderDetailsChangeStatus,
} = require("../constants/booking.constant");
const { formatDateInsert, formatDateToHAM, formatDate } = require("../utils/common");
const { findFootballByNotInIds } = require("../models/repositories/football.repository");

class OrderService {
  static createOrder = async ({
    user,
    football,
    phoneNumber,
    type,
    selectedDates = [],
    selectedDate = "",
    startTime,
    endTime,
  }) => {
    /**
     * type = enum ['day', 'month', 'year']
     * Step 1: Check order
     */

    // Format to HH:mm
    const fEndTimeToHAM = formatDateToHAM(endTime);
    const fStartTimeToHAM = formatDateToHAM(startTime);

    if (type === BookingTypes.day) {
      const checkOrderExist = await findOrderDetailsByUser({
        user,
        football,
        date: formatDate(selectedDate, "YYYY-MM-DD"), // -> format to YYYY-MM-DD
        startTime: fEndTimeToHAM,
        endTime: fStartTimeToHAM,
      });

      if (checkOrderExist.length) {
        throw new ConflictRequestError(`Order exist!`);
      }
    } else {
      // Check selectedDates
      await Promise.all(
        selectedDates.map(
          (date) =>
            new Promise(async (resolve, reject) => {
              try {
                // Format date from 'DD/MM/YYYY' to 'YYYY-MM-DD'
                const fDate = formatDate(date, "YYYY-MM-DD", "DD/MM/YYYY");

                const checkOrderExist = await findOrderDetailsByUser({
                  user,
                  football,
                  date: fDate,
                  startTime: fEndTimeToHAM,
                  endTime: fStartTimeToHAM,
                });

                if (checkOrderExist.length) {
                  throw new ConflictRequestError(`Order exist!`);
                }

                resolve();
              } catch (error) {
                reject(error);
              }
            })
        )
      );
    }

    // Step 2: Create order
    const orderAdded = await addOrder({ user, phoneNumber, type });

    if (!orderAdded) {
      throw new InternalServerRequestError(`Error: Can't create order`);
    }

    const orderId = orderAdded._id;

    // Step 3: Create order details
    if (type === BookingTypes.day) {
      // Format form Date -> DD/MM/YYYY
      const fDate = formatDate(selectedDate);

      // Format from DD/MM/YYYY HH:mm -> toDate()
      const convertStartTime = formatDateInsert(`${fDate} ${fStartTimeToHAM}`, "DD/MM/YYYY HH:mm");
      const convertEndTime = formatDateInsert(`${fDate} ${fEndTimeToHAM}`, "DD/MM/YYYY HH:mm");

      await addOrderDetails({
        date: new Date(selectedDate),
        endTime: convertEndTime,
        startTime: convertStartTime,
        football,
        order: orderId,
      });

      return orderId;
    }

    // Default date DD/MM/YYYY
    const orderDetailsInsertMany = selectedDates.map((date) => {
      // Format from DD/MM/YYYY HH:mm -> toDate()
      const convertStartTime = formatDateInsert(`${date} ${fStartTimeToHAM}`, "DD/MM/YYYY HH:mm");
      const convertEndTime = formatDateInsert(`${date} ${fEndTimeToHAM}`, "DD/MM/YYYY HH:mm");

      return {
        date: formatDateInsert(date),
        endTime: convertEndTime,
        startTime: convertStartTime,
        football,
        order: orderId,
      };
    });

    await addOrderDetails(orderDetailsInsertMany);

    return orderId;
  };

  static getAllOrder = async (filters = {}) => {
    const response = await findOrder(filters);
    return response;
  };

  static getOrderDetailsByTime = async ({ date, startTime, endTime }) => {
    const response = await findOrderDetailsByTime({ startTime, endTime, date });
    return response;
  };

  static getFootballNotInOrder = async ({ date, startTime, endTime }) => {
    const convertDate = String(date).split(",");

    // Results ordersDetails
    let response = await Promise.all(
      convertDate.map(
        async (t) =>
          await findOrderDetailsByTime({
            startTime,
            endTime,
            date: t.trim(),
            notIns: [OrderDetailsStatus.finished, OrderDetailsStatus.canceled],
          })
      )
    );

    response = response
      .reduce((t, v) => (t = [...t, ...v]), [])
      .sort(
        (a, b) => formatDateInsert(a.date, "DD/MM/YYYY") - formatDateInsert(b.date, "DD/MM/YYYY")
      );

    return response;

    if (!response.length) return [];

    const footballIds = [...new Set(response.map((t) => t.football))];

    const results = await findFootballByNotInIds(footballIds);

    return results;
  };

  static filterDatesByTime = async ({ date, startTime, endTime, footballId }) => {
    const convertDate = String(date).split(",");

    console.log(`convertDate`, convertDate);

    // Results ordersDetails
    let response = await Promise.all(
      convertDate.map(
        async (t) =>
          await findOrderDetailsByTime({
            startTime,
            endTime,
            date: t.trim(),
            notIns: [OrderDetailsStatus.finished, OrderDetailsStatus.canceled],
            footballId,
          })
      )
    );

    response = response
      .reduce((t, v) => (t = [...t, ...v]), [])
      .sort(
        (a, b) => formatDateInsert(a.date, "DD/MM/YYYY") - formatDateInsert(b.date, "DD/MM/YYYY")
      );

    const datesConvertMap = convertDate.map((t) => formatDate(t));

    if (!response.length) return datesConvertMap;

    const dates = [...new Set(response.map((t) => t.date))];

    const result = datesConvertMap.filter((item) => !dates.includes(item));

    return result;
  };

  static changeStatus = async (orderDetailsId) => {
    const orderDetails = await findOderDetailsById(orderDetailsId);

    if (!orderDetails) {
      throw new NotFoundRequestError(`Order details not found!`);
    }

    const statusOld = orderDetails.status;

    const updated = await updateOrderDetails(orderDetailsId, {
      status: OrderDetailsChangeStatus[statusOld],
    });

    if (!updated) {
      throw new InternalServerRequestError("Can't change status!");
    }

    return true;
  };

  static updateOrderDetails = async (orderDetailsId, data) => {
    const orderDetails = await findOderDetailsById(orderDetailsId);

    if (!orderDetails) {
      throw new NotFoundRequestError(`Order details not found!`);
    }

    const updated = await updateOrderDetails(orderDetailsId, data);

    if (!updated) {
      throw new InternalServerRequestError("Can't change status!");
    }

    return true;
  };
}

module.exports = OrderService;
