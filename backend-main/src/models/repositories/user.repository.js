"use strict";

const userModel = require("../user.model");
const UserRoles = require("../../constants/userRole.constant");
const { isEmpty } = require("lodash");
const { parserParams } = require("../../helpers/filterData.helper");

const findUserByUsername = async (username) => {
  const response = await userModel.findOne({ username }).lean();
  return response;
};

const checkExistAdmin = async () => {
  const response = await userModel.findOne({ role: UserRoles.admin }).lean();
  return Boolean(response);
};

const addUser = async (data) => {
  const response = await userModel.create(data);
  return response;
};

const updateUser = async (id, data) => {
  const response = await userModel.findByIdAndUpdate(id, data);
  return response;
};

const findUserById = async (userId, select = "") => {
  const response = await userModel.findById(userId).select(select).lean();
  return response;
};

const findAllUser = async (filters = {}) => {
  const { options, limit, page, skip, sortBy } = parserParams(filters);

  const response = await userModel
    .find(options)
    .select("-password")
    .limit(limit)
    .skip(skip)
    .sort(sortBy);

  const total = await userModel.countDocuments(options);

  return {
    response,
    pagination: {
      page,
      limit,
      totalRows: Math.ceil(total / limit),
    },
  };
};

module.exports = {
  findUserByUsername,
  checkExistAdmin,
  findUserById,
  addUser,
  findAllUser,
  updateUser,
};
