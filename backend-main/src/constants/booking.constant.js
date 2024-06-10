"use strict";

const BookingTypes = {
  day: "day",
  month: "month",
  year: "year",
};

const OrderDetailsStatus = {
  new: "new",
  processing: "processing",
  finished: "finished",
  canceled: "canceled",
};

const OrderDetailsChangeStatus = {
  new: "processing",
  processing: "finished",
  finished: "finished",
  canceled: "canceled",
};

module.exports = {
  BookingTypes,
  OrderDetailsStatus,
  OrderDetailsChangeStatus,
};
