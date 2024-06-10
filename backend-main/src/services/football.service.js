"use strict";

const {
  addFootball,
  findAllFootball,
  findFootballById,
  updateFootball,
  findFootballByCategoryAndNumber,
} = require("../models/repositories/football.repository");
const {
  BadRequestError,
  ConflictRequestError,
  NotFoundRequestError,
} = require("../utils/error.response");
const { mapperImageToFilename, unlink } = require("../utils/upload");

class FootballService {
  static createFootball = async (data) => {
    const footballExist = await findFootballByCategoryAndNumber(data.category, data.number);

    if (footballExist) {
      throw new ConflictRequestError(`Football was exist with category and number!`);
    }

    const response = await addFootball({
      name: data.name,
      number: data.number,
      category: data.category,
      thumbNail: data.thumbNail,
      price: data.price,
      images: data.images,
      status: data.status,
      isActive: data.isActive,
    });

    if (!response) {
      throw new BadRequestError(`Can't create football`);
    }

    return response;
  };

  static getAllFootball = async (filters = {}) => {
    const response = await findAllFootball(filters);
    return response;
  };

  static getFootballById = async (id) => {
    const response = await findFootballById(id);

    if (!response) {
      throw new NotFoundRequestError(`Not found Football by id`);
    }

    return response;
  };

  static updateFootball = async (id, data) => {
    const [footballExist, football] = await Promise.all([
      findFootballByCategoryAndNumber(data.category, data.number),
      this.getFootballById(id),
    ]);

    if (!football) {
      throw new NotFoundRequestError(`Football not found!`);
    }

    if (footballExist && footballExist._id.toString() !== id) {
      throw new ConflictRequestError(`Football was exist!`);
    }

    let imagesOld = [...football.images];

    if (data.imageDeleted) {
      if (Array.isArray(data.imageDeleted)) {
        const cloneImageDeleted = [...data.imageDeleted].map((t) => mapperImageToFilename(t));
        imagesOld = imagesOld.filter((t) => !cloneImageDeleted.includes(t));
      } else {
        const deleteImage = mapperImageToFilename(data.imageDeleted);
        imagesOld = imagesOld.filter((t) => t !== deleteImage);
      }
    }

    if (data.images) {
      data.images = [...imagesOld, ...data.images];
    }

    const response = await updateFootball(id, {
      name: data.name,
      number: data.number,
      category: data.category,
      thumbNail: data.thumbNail,
      price: data.price,
      images: data.images,
      status: data.status,
      isActive: data.isActive,
    });

    if (!response) {
      throw new BadRequestError(`Can't update football`);
    }

    if (data.imageDeleted) {
      if (Array.isArray(data.imageDeleted)) {
        const cloneImageDeleted = [...data.imageDeleted].map((t) => mapperImageToFilename(t));
        cloneImageDeleted.forEach((image) => unlink(image));
      } else {
        const deleteImage = mapperImageToFilename(data.imageDeleted);
        unlink(deleteImage);
      }
    }

    return response;
  };

  static deleteFootball = async (id) => {
    const response = await this.getFootballById(id);

    await response.deleteOne();

    return true;
  };
}

module.exports = FootballService;
