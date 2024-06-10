"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Category";
const COLLECTION_NAME = "Categories";

// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      index: true,
    },
    image: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, categorySchema);
