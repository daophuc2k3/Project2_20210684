"use strict";

const keyTokenModel = require("../keyToken.model");

const findKeyStoreByUserId = async (userId) => {
  const response = await keyTokenModel.findOne({ user: userId }).exec();
  return response;
};

const addKeyStore = async ({ userId, publicKey, privateKey, refreshToken }) => {
  await keyTokenModel
    .findOneAndUpdate(
      { user: userId },
      {
        $set: {
          privateKey,
          publicKey,
          refreshToken,
        },
      },
      {
        upsert: true,
        new: true,
      }
    )
    .lean()
    .exec();

  return true;
};

const removeKeyTokenById = async (id) => {
  const response = await keyTokenModel.findByIdAndDelete(id);
  return response;
};

const deleteKeyStoreByUserId = async (userId) => {
  const response = await keyTokenModel.findOneAndDelete({
    user: userId,
  });
  return response;
};

module.exports = {
  findKeyStoreByUserId,
  addKeyStore,
  removeKeyTokenById,
  deleteKeyStoreByUserId,
};
