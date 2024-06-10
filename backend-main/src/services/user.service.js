"use strict";

const { findAllUser, updateUser } = require("../models/repositories/user.repository");
const { NotFoundRequestError } = require("../utils/error.response");

class UserService {
  static getAll = async (filters = {}) => {
    const response = await findAllUser(filters);
    return response;
  };

  static updateUser = async (id, data) => {
    const response = await updateUser(id, data);

    if (!response) {
      throw new NotFoundRequestError(`User not found!`);
    }

    return true;
  };
}

module.exports = UserService;
