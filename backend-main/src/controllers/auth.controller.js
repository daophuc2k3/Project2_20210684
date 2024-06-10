"use strict";

const AuthService = require("../services/auth.service");
const { validateObjectId } = require("../utils/common");
const { BadRequestError } = require("../utils/error.response");
const { Created, Ok } = require("../utils/success.response");

class AuthController {
  signUp = async (req, res) => {
    const body = req.body;

    if (!body.displayName || !body.password || !body.username) {
      throw new BadRequestError("Missing `displayName`, `password`, `username`");
    }

    const response = await AuthService.signUp({
      displayName: body.displayName,
      password: body.password,
      username: body.username,
    });

    return new Created({
      message: "Register success.",
      metadata: response,
    }).send(res);
  };

  signIn = async (req, res) => {
    const body = req.body;

    if (!body.password || !body.username) {
      throw new BadRequestError("Missing body `username`, `password`");
    }

    const response = await AuthService.login({
      password: body.password,
      username: body.username,
    });

    return new Ok({
      message: "Login success.",
      metadata: response,
    }).send(res);
  };

  refreshToken = async (req, res) => {
    const response = await AuthService.refreshToken({
      refreshToken: req.refreshToken,
      user: req.user,
      keyStore: req.keyStore,
    });

    return new Ok({
      message: "RefreshToken success.",
      metadata: response,
    }).send(res);
  };

  logout = async (req, res) => {
    const response = await AuthService.logout(req.keyStore);

    return new Ok({
      message: "Logout success.",
      metadata: response,
    }).send(res);
  };

  getCurrentUserSignIn = async (req, res) => {
    const keyStore = req.keyStore;

    validateObjectId({
      id: keyStore.user,
      message: `\`_id\` = ${keyStore.user} Invalid`,
    });

    const response = await AuthService.getCurrentUserSignIn(keyStore.user);

    return new Ok({
      message: "Get Current User Sign In Success.",
      metadata: response,
    }).send(res);
  };
}

module.exports = new AuthController();
