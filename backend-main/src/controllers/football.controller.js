"use strict";

const FootballService = require("../services/football.service");
const { BadRequestError } = require("../utils/error.response");
const { Created, Ok } = require("../utils/success.response");
const { mapperImage } = require("../utils/upload");

class FootballController {
  createFootball = async (req, res) => {
    const data = req.body;
    const files = req.files;

    if (!data.name || !data.number || !data.category || !data.price) {
      throw new BadRequestError(`Missing \`name\` or \`number\` or \`category\` or \`price\``);
    }

    if (files?.thumbNail) {
      data.thumbNail = files?.thumbNail[0].filename;
    }

    if (files?.images?.length) {
      data.images = files?.images?.map((t) => t.filename);
    }

    return new Created({
      message: "Create football successfully",
      metadata: await FootballService.createFootball(data),
    }).send(res);
  };

  updateFootball = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const files = req.files;

    if (!data.name || !data.number || !data.category || !data.price) {
      throw new BadRequestError(`Missing \`name\` or \`number\` or \`category\` or \`price\``);
    }

    if (files?.thumbNail) {
      data.thumbNail = files?.thumbNail[0].filename;
    } else {
      delete data.thumbNail;
    }

    if (files?.images?.length) {
      data.images = files?.images?.map((t) => t.filename);
    } else {
      delete data.images;
    }

    return new Ok({
      message: "Update football successfully",
      metadata: await FootballService.updateFootball(id, data),
    }).send(res);
  };

  getAllFootball = async (req, res) => {
    const data = req.query;

    const { pagination, response } = await FootballService.getAllFootball(data);

    const result = response?.map((t) => {
      return {
        ...t,
        thumbNail: t?.thumbNail ? mapperImage(t.thumbNail) : "",
        images: t.images.length ? t.images.map((img) => mapperImage(img)) : [],
      };
    });

    return new Ok({
      message: "Get all football successfully",
      metadata: result,
      options: pagination,
    }).send(res);
  };

  getFootballById = async (req, res) => {
    const id = req.params.id;

    return new Ok({
      message: "Get football by id successfully",
      metadata: await FootballService.getFootballById(id),
    }).send(res);
  };

  deleteFootballId = async (req, res) => {
    const id = req.params.id;

    return new Ok({
      message: "Delete football successfully",
      metadata: await FootballService.deleteFootball(id),
    }).send(res);
  };
}

module.exports = new FootballController();
