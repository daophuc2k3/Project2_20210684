"use strict";

const { Ok } = require("../utils/success.response");
const UserService = require("../services/user.service");

class UserController {
  getAll = async (req, res) => {
    const { pagination, response } = await UserService.getAll(req.query);

    return new Ok({
      message: "Get all user success.",
      metadata: response,
      options: pagination,
    }).send(res);
  };

  updateUser = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const file = req.file;

    if (file) {
      data.avatar = file.filename;
    } else {
      delete data?.avatar;
    }

    return new Ok({
      message: "Update profile successfully",
      metadata: await UserService.updateUser(id, data),
    }).send(res);
  };
}

module.exports = new UserController();
