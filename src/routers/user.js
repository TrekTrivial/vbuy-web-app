const express = require("express");
const userRouter = new express.Router();
const db = require("../db").db;

module.exports = userRouter;
