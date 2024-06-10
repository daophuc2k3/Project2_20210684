"use strict";

const JWT = require("jsonwebtoken");
const {
  ForbiddenRequestError,
  NotFoundRequestError,
  UnauthorizedRequestError,
} = require("../utils/error.response");
const { Headers } = require("../constants/auth.constant");
const { findKeyStoreByUserId } = require("../models/repositories/keyToken.repository");

const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: process.env.JWT_AC_EXPIRES || "2d",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: process.env.JWT_RF_EXPIRES || "2d",
  });

  return { accessToken, refreshToken };
};

const verifyToken = (token, key) => {
  try {
    const decode = JWT.verify(token, key);

    return decode;
  } catch (error) {
    throw new UnauthorizedRequestError(error.message);
  }
};

const authentication = async (req, _, next) => {
  const userId = req.headers[Headers.CLIENT_ID]?.toString();

  if (!userId) {
    throw new ForbiddenRequestError("Missing `x-client-id` Request Header...");
  }

  // 2 - get accessToken
  const keyStore = await findKeyStoreByUserId(userId);

  if (!keyStore) {
    throw new NotFoundRequestError("Key Store Not Found!");
  }

  // If url is logout return next
  console.log("path authentication => ", req.url);

  if (req.url === "/sign-out") {
    req.keyStore = keyStore;
    return next();
  }

  const refreshToken = req.headers[Headers.REFRESH_TOKEN]?.toString();

  if (refreshToken) {
    const decode = verifyToken(refreshToken, keyStore.privateKey);

    if (userId !== decode?.userId) {
      throw new ForbiddenRequestError("Invalid UserId");
    }

    req.keyStore = keyStore;
    req.user = decode;
    req.refreshToken = refreshToken;

    return next();
  }

  let accessToken = req.headers[Headers.AUTHORIZATION]?.toString();

  console.log(`accessToken ::`, accessToken);

  if (!accessToken) {
    throw new ForbiddenRequestError("Missing `authorization` Request Header...");
  }

  accessToken = String(accessToken).split("Bearer ")[1];

  console.log(`accessTokenV2 :: ${accessToken}`, keyStore);

  // 3 - verify Token
  const decode = verifyToken(accessToken.trim(), keyStore.publicKey);

  console.log(`decode ::`, decode);

  // 5 - check keyStore with this userId?
  if (userId !== decode?.userId) {
    throw new ForbiddenRequestError("Invalid UserId");
  }

  // 6 - Ok all => return next().
  req.keyStore = keyStore;
  return next();
};

module.exports = {
  createTokenPair,
  verifyToken,
  authentication,
};
