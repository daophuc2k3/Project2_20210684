"use strict";

const productModel = require("../product.model");
const { parserParams } = require("../../helpers/filterData.helper");

const findProductByName = async (name, type) => {
  const response = await productModel.findOne({ name, type });
  return response;
};

const updateProduct = async (id, data) => {
  const response = await productModel.findByIdAndUpdate(id, data, { new: true });
  return response;
};

const addProduct = async (data) => {
  const response = await productModel.create(data);
  return response;
};

const findProductById = async (categoryId) => {
  const response = await productModel.findById(categoryId).exec();
  return response;
};

const findAllProduct = async (filters = {}) => {
  const { options, limit, page, skip, sortBy } = parserParams(filters);

  const response = await productModel.find(options).limit(limit).skip(skip).sort(sortBy).lean();

  const total = await productModel.countDocuments(options);

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
  findProductByName,
  findProductById,
  addProduct,
  findAllProduct,
  updateProduct,
};
