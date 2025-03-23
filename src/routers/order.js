const express = require("express");
const router = new express.Router();
const db = require("../db").db;
const auth = require("../middleware/auth");
const shipping = require("../services/shiprocket");

router.post("/create", auth, async (req, res) => {
  const { id } = req.user;
  const orderID = "VB" + id;
  const { cartID, orderTotal, orderDate, orderStatus } = req.body;

  const sql = `INSERT INTO ORDERS (orderID, userID, cartID, orderTotal, orderDate, orderStatus) VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    await db.query(sql, [
      orderID,
      id,
      cartID,
      orderTotal,
      orderDate,
      orderStatus,
    ]);
    res.status(201).send({ message: "Order created" });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

router.delete("/delete/:orderID", auth, async (req, res) => {
  const orderID = req.params.orderID;

  const sql = `DELETE FROM ORDERS WHERE orderID=?`;
  try {
    await db.query(sql, [orderID]);
    res.status(200).send({ message: "Order deleted" });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

module.exports = router;
