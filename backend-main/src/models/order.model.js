"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      index: true,
      ref: "User",
    },
    phoneNumber: {
      type: String,
      maxLength: 10,
      index: true,
    },
    type: {
      type: String,
      enum: ["day", "month", "year"],
      default: "day",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
