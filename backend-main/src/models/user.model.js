"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      maxLength: 150,
      index: true,
    },
    email: {
      type: String,
      default: null,
      maxLength: 150,
    },
    username: {
      type: String,
      maxLength: 150,
      unique: true,
      required: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      maxLength: 10,
      index: true,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "client"],
      default: "client",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    versionKey: false,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
