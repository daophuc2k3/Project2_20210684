"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");
const { BadRequestError } = require("./error.response");
const moment = require("moment");

const getInfoData = (fields = [], object = {}) => {
  return _.pick(object, fields);
};

const validateObjectId = ({ id, message = "Id Invalid" }) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new BadRequestError(message);
  }
};

const formatDateInsert = (date, format = "DD/MM/YYYY") => moment(date, format).toDate();

const formatDateToHAM = (date) => moment(date).format("HH:mm");

const formatDate = (date, format = "DD/MM/YYYY", formatOld = "") =>
  moment(date, formatOld ?? undefined).format(format);

const toDate = (dateStr) => moment(dateStr).toDate();

module.exports = {
  getInfoData,
  validateObjectId,
  formatDateInsert,
  formatDateToHAM,
  formatDate,
  toDate,
};
