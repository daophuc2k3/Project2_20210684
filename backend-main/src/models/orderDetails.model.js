"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "OrderDetail";
const COLLECTION_NAME = "OrderDetails";

// Declare the Schema of the Mongo model
const orderDetailsSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.ObjectId,
      required: true,
      index: true,
      ref: "Order",
    },
    football: {
      type: mongoose.Schema.ObjectId,
      required: true,
      index: true,
      ref: "Football",
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "processing", "finished", "canceled"],
      default: "new",
      index: true,
    },
    // Tổng tiền
    totalCost: {
      type: Number,
      default: 0,
    },
    // tiền khách đưa
    receivedCost: {
      type: Number,
      default: 0,
    },
    // tiền thừa
    changeCost: {
      type: Number,
      default: 0,
    },
    extraFee: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
    services: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false,
  }
);
//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderDetailsSchema);
