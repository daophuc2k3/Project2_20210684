"use strict";

const footballModel = require("../football.model");
const { parserParams } = require("../../helpers/filterData.helper");

const updateFootball = async (id, data) => {
  const response = await footballModel.findByIdAndUpdate(id, data, { new: true });
  return response;
};

const findFootballByCategoryAndNumber = async (category, number) => {
  const response = await footballModel.findOne({ category, number });
  return response;
};

const addFootball = async (data) => {
  const response = await footballModel.create(data);
  return response;
};

const findFootballById = async (categoryId) => {
  const response = await footballModel.findById(categoryId).exec();
  return response;
};

const findAllFootball = async (filters = {}) => {
  const { options, limit, page, skip, sortBy } = parserParams(filters);

  const response = await footballModel
    .find(options)
    .populate("category", "-__v -createdAt -updatedAt")
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .lean();

  const total = await footballModel.countDocuments(options);

  return {
    response,
    pagination: {
      page,
      limit,
      totalRows: Math.ceil(total / limit),
    },
  };
};

const findFootballByNotInIds = async (ids) => {
  const response = await footballModel
    .find({
      _id: {
        $nin: ids,
      },
      isActive: true,
      status: {
        $nin: ["maintain"],
      },
    })
    .populate("category")
    .sort({ category: "asc" })
    .lean();

  return response;
};

module.exports = {
  findFootballByCategoryAndNumber,
  findFootballById,
  addFootball,
  findAllFootball,
  updateFootball,
  findFootballByNotInIds,
};
