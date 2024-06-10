"use strict";

const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const comparePassword = async (password, passwordHash) => {
  const response = await bcrypt.compare(password, passwordHash);
  return Boolean(response);
};

module.exports = {
  hashPassword,
  comparePassword,
};
