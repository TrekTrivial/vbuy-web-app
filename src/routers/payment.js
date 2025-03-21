const express = require("express");
const paymentRouter = new express.Router();
const db = require("../db").db;

module.exports = paymentRouter;
