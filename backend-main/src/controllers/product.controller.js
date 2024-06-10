"use strict";

const ProductService = require("../services/product.service");
const { BadRequestError } = require("../utils/error.response");
const { Created, Ok } = require("../utils/success.response");
const { mapperImage } = require("../utils/upload");

class ProductController {
  createProduct = async (req, res) => {
    const data = req.body;
    const file = req.file;

    if (!data.name || !data.price || !data.type || !file) {
      throw new BadRequestError(`Missing \`name\`, \`price\`, \`type\`, \`file\``);
    }

    return new Created({
      message: "Create product successfully",
      metadata: await ProductService.createProduct({ ...data, image: file.filename }),
    }).send(res);
  };

  updateProduct = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const file = req.file;

    if (!data.name || !data.price || !data.type) {
      throw new BadRequestError(`Missing \`name\`, \`price\`, \`type\``);
    }

    if (file) {
      data.image = file.filename;
    } else {
      delete data.image;
    }

    return new Ok({
      message: "Update product successfully",
      metadata: await ProductService.updateProduct(id, data),
    }).send(res);
  };

  getAllProduct = async (req, res) => {
    const data = req.query;

    const { pagination, response } = await ProductService.getAll(data);

    return new Ok({
      message: "Get all product successfully",
      metadata: response?.map((t) => ({ ...t, image: mapperImage(t.image) })),
      options: pagination,
    }).send(res);
  };

  getProductById = async (req, res) => {
    const id = req.params.id;

    return new Ok({
      message: "Get product by id successfully",
      metadata: await ProductService.getById(id),
    }).send(res);
  };

  deleteProductId = async (req, res) => {
    const id = req.params.id;

    return new Ok({
      message: "Delete product successfully",
      metadata: await ProductService.deleteById(id),
    }).send(res);
  };
}

module.exports = new ProductController();
