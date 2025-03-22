const express = require("express");
const axios = require("axios");
const router = new express.Router();
const db = require("../db").db;

const getMarketPrice = async isbn => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${isbn}`;
  try {
    const { data } = await axios.get(url);
    const listPrice = data.items[0].saleInfo.listPrice.amount;
    return listPrice;
  } catch (e) {
    console.error(e);
    return;
  }
};

const calculatePrice = (mrp, perc) => {
  return Math.ceil(mrp * perc);
};

router.get("/calculate", async (req, res) => {
  const price = calculatePrice(await getMarketPrice(9789354358913), 0.3);
  console.log(price);
  res.status(200).send({ price });
});

router.post("/calculate", (req, res) => {
  const price = Number(req.query.price);
  console.log(calculatePrice(price));
  res.status(200).send();
});

module.exports = router;
