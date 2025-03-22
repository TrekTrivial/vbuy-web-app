const express = require("express");
const router = new express.Router();
const db = require("../db").db;
const gateway = require("../services/razorpay");

module.exports = router;
