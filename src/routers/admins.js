const express = require("express");
const router = new express.Router();
const db = require("../db").db;
const jwt = require("jsonwebtoken");
const adminAuth = require("../middleware/adminAuth");
const { supportReply } = require("../utils/email");
const { calculatePrice } = require("../services/googlebooks");
const gateway = require("../services/razorpay");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [admin] = await db.query(
      `SELECT * FROM ADMINS WHERE adminID=? AND adminPass=?`,
      [username, password]
    );
    if (admin.length === 0) {
      return res.status(403).send({ error: "Invalid credentials!" });
    }
    const token = jwt.sign({ id: username }, process.env.JWT_SECRET_ADMIN, {
      expiresIn: "7d",
    });
    await db.query(
      `UPDATE ADMINS SET tokens=JSON_ARRAY_APPEND(tokens, '$', ?)`,
      [token]
    );
    res.status(200).send({ message: "Logged in!", token });
  } catch (e) {
    res.status(500).send({ error: "Error", e: e.message });
  }
});

router.post("/calculate", adminAuth, (req, res) => {
  try {
    const { customPrice } = req.body;
    const costPrice = calculatePrice(customPrice, 0.3);
    res.status(200).send({ costPrice });
  } catch (e) {
    res.status(500).send({ error: "Error", e: e.message });
  }
});

router.get("/all", adminAuth, async (req, res) => {
  const sql = `SELECT * FROM USERS`;
  try {
    const [results] = await db.query(sql);
    res.status(200).send({ results });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

router.post("/debug_queries", adminAuth, async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM USERS WHERE email=?`, [
      "koxave2376@motivue.com",
    ]);
    console.log(data[0]);
    res.send();
  } catch (e) {
    console.log(e);
  }
});

router.patch("/reply/:ticketID", adminAuth, async (req, res) => {
  const { ticketID } = req.params;
  const { reply } = req.body;

  try {
    const [result] = await db.query(
      `SELECT userID FROM SUPPORT WHERE ticketID=?`,
      [ticketID]
    );
    const ticket = result[0];

    const [results] = await db.query(
      `SELECT firstName, lastName, email FROM USERS WHERE userID=?`,
      [ticket.userID]
    );
    const user = results[0];

    const sql = `UPDATE SUPPORT SET replyMessage=?, ticketStatus=? WHERE ticketID=?`;
    await db.query(sql, [reply, "Closed", ticketID]);

    const name = user.firstName + " " + user.lastName;
    const email = user.email;
    await supportReply(name, email, reply, ticketID);

    res.status(200).send({ message: "Ticket resolved" });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

router.post("/payments/transfer/bank", adminAuth, async (req, res) => {
  const { id, orderID } = req.body;

  try {
    const [account] = await db.query(
      `SELECT fund_account_id FROM BANK_ACCOUNT WHERE userID=?`,
      [id]
    );
    const fund_account_id = account[0].fund_account_id;

    const [order] = await db.query(
      `SELECT orderTotal FROM ORDERS WHERE orderID=?`,
      [orderID]
    );
    const amount = order[0].orderTotal;

    const payout_id = await gateway.makePayoutBank(fund_account_id, amount);

    await db.query(
      `UPDATE PAYMENTS SET transactionID=?, paymentStatus=? where orderID=?`,
      [payout_id, "completed", orderID]
    );
    res.status(200).send({ message: "Payout successful" });
  } catch (e) {
    res.status(500).send({ error: "Error making payout", e });
  }
});

router.post("/payments/transfer/vpa", adminAuth, async (req, res) => {
  const { id, orderID } = req.body;

  try {
    const [account] = await db.query(
      `SELECT fund_account_id FROM BANK_ACCOUNT WHERE userID=?`,
      [id]
    );
    console.log(account[0]);
    const fund_account_id = account[0].fund_account_id;

    const [order] = await db.query(
      `SELECT orderTotal FROM ORDERS WHERE orderID=?`,
      [orderID]
    );
    const amount = order[0].orderTotal;

    const payout_id = await gateway.makePayoutVPA(fund_account_id, amount);

    await db.query(
      `UPDATE PAYMENTS SET transactionID=?, paymentStatus=? where orderID=?`,
      [payout_id, "completed", orderID]
    );

    res.status(200).send({ message: "Payout successful" });
  } catch (e) {
    res.status(500).send({ error: "Error making payout", e: e.message });
  }
});

module.exports = router;
