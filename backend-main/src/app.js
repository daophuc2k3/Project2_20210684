const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { catchResourceNotFound, catchInternalServerError } = require("./helpers/handleError.helper");
const app = express();
const cors = require("cors");

// init static path
app.use(express.static(__dirname + "/assets/upload"));

// init middlewares
app.use(
  cors({
    origin: process.env.FE_ENDPOINT,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// init db
require("./dbs/init.mongodb");

// init routes
app.use(require("./routes"));

// handling error
app.use(catchResourceNotFound);
app.use(catchInternalServerError);

module.exports = app;
