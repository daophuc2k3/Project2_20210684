"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Football";
const COLLECTION_NAME = "Footballs";

// Declare the Schema of the Mongo model
var footballSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    number: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      required: true,
      index: true,
      ref: "Category",
    },
    thumbNail: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      enum: ["available", "maintain"],
      default: "available",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, footballSchema);
