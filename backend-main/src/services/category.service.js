"use strict";

const { formatSlug } = require("../helpers/slugify.helper");
const {
  findCategoryBySlug,
  addCategory,
  findAllCategory,
  findCategoryById,
  updateCategory,
} = require("../models/repositories/category.repository");
const {
  ConflictRequestError,
  BadRequestError,
  NotFoundRequestError,
} = require("../utils/error.response");

class CategoryService {
  static createCategory = async ({ name, quantity }) => {
    const categorySlug = formatSlug(name);
    const categoryExist = await findCategoryBySlug(categorySlug);

    if (categoryExist) {
      throw new ConflictRequestError(`Category was exist!`);
    }

    const response = await addCategory({ name, slug: categorySlug, quantity });

    if (!response) {
      throw new BadRequestError(`Error: Can't create slug`);
    }

    return response;
  };

  static updateCategory = async (id, { name, quantity }) => {
    const categorySlug = formatSlug(name);
    const categoryExist = await findCategoryBySlug(categorySlug);

    if (categoryExist && categoryExist._id.toString() !== id) {
      throw new ConflictRequestError(`Category was exist!`);
    }

    const response = await updateCategory(id, { name, slug: categorySlug, quantity });

    if (!response) {
      throw new BadRequestError(`Error: Can't update slug`);
    }

    return response;
  };

  static getAll = async (filters = {}) => {
    const response = await findAllCategory(filters);
    return response;
  };

  static getById = async (id) => {
    const response = await findCategoryById(id);

    if (!response) {
      throw new NotFoundRequestError(`Category not found!`);
    }

    return response;
  };

  static deleteById = async (id) => {
    const response = await this.getById(id);

    await response.deleteOne();

    return true;
  };
}

module.exports = CategoryService;
