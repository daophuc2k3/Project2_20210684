"use strict";

const CategoryService = require("../services/category.service");
const { BadRequestError } = require("../utils/error.response");
const { Created, Ok } = require("../utils/success.response");

class CategoryController {
  createCategory = async (req, res) => {
    const data = req.body;

    if (!data.name || !data.quantity) {
      throw new BadRequestError(`Missing \`name\`, \`quantity\``);
    }

    return new Created({
      message: "Create category successfully",
      metadata: await CategoryService.createCategory(data),
    }).send(res);
  };

  updateCategory = async (req, res) => {
    const data = req.body;
    const id = req.params.id;

    if (!data.name || !data.quantity) {
      throw new BadRequestError(`Missing \`name\`, \`quantity\``);
    }

    return new Ok({
      message: "Update category successfully",
      metadata: await CategoryService.updateCategory(id, data),
    }).send(res);
  };

  getAllCategory = async (req, res) => {
    const data = req.query;

    const { pagination, response } = await CategoryService.getAll(data);

    return new Ok({
      message: "Get all category successfully",
      metadata: response,
      options: pagination,
    }).send(res);
  };

  getCategoryById = async (req, res) => {
    const id = req.params.id;

    return new Ok({
      message: "Get category by id successfully",
      metadata: await CategoryService.getById(id),
    }).send(res);
  };

  deleteCategoryId = async (req, res) => {
    const id = req.params.id;

    return new Ok({
      message: "Delete category successfully",
      metadata: await CategoryService.deleteById(id),
    }).send(res);
  };

  updateStatus = async (req, res) => {
    const { status } = req.body;
    const categoryId = req.params.id;

    return new Ok({
      message: "Update status successfully",
      metadata: await CategoryService.updateStatus(categoryId, status),
    }).send(res);
  };
}

module.exports = new CategoryController();
