"use strict";

const categoryModel = require("../category.model");
const { parserParams } = require("../../helpers/filterData.helper");

const findCategoryBySlug = async (slug) => {
  const response = await categoryModel.findOne({ slug });
  return response;
};

const updateCategory = async (id, data) => {
  const response = await categoryModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  return response;
};

const addCategory = async (data) => {
  const response = await categoryModel.create(data);
  return response;
};

const findCategoryById = async (categoryId) => {
  const response = await categoryModel.findById(categoryId).exec();
  return response;
};

const findAllCategory = async (filters = {}) => {
  const { options, limit, page, skip, sortBy } = parserParams(filters);

  const response = await categoryModel
    .find(options)
    .limit(limit)
    .skip(skip)
    .sort(sortBy);

  const total = await categoryModel.countDocuments(options);

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
  findCategoryBySlug,
  findCategoryById,
  addCategory,
  findAllCategory,
  updateCategory,
};
