"use strict";

const { formatSlug } = require("../helpers/slugify.helper");
const {
  findProductByName,
  addProduct,
  findAllProduct,
  findProductById,
  updateProduct,
} = require("../models/repositories/product.repository");
const {
  ConflictRequestError,
  BadRequestError,
  NotFoundRequestError,
} = require("../utils/error.response");

class ProductService {
  static createProduct = async ({ name, price, image, type }) => {
    const productExist = await findProductByName(name, type);

    if (productExist) {
      throw new ConflictRequestError(`Product was exist!`);
    }

    const response = await addProduct({ name, price, image, type });

    if (!response) {
      throw new BadRequestError(`Error: Can't create product`);
    }

    return response;
  };

  static updateProduct = async (id, { name, price, image, type }) => {
    const productExist = await findProductByName(name, type);

    if (productExist && productExist._id.toString() !== id) {
      throw new ConflictRequestError(`Product was exist!`);
    }

    const response = await updateProduct(id, { name, price, image, type });

    if (!response) {
      throw new BadRequestError(`Error: Can't update product`);
    }

    return response;
  };

  static getAll = async (filters = {}) => {
    const response = await findAllProduct(filters);

    return response;
  };

  static getById = async (id) => {
    const response = await findProductById(id);

    if (!response) {
      throw new NotFoundRequestError(`Product not found!`);
    }

    return response;
  };

  static deleteById = async (id) => {
    const response = await this.getById(id);

    await response.deleteOne();

    return true;
  };
}

module.exports = ProductService;
