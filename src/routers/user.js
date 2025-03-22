const express = require("express");
const router = new express.Router();
const db = require("../db").db;
const bcrypt = require("bcryptjs");

router.post("/create", async (req, res) => {
  const { userID, firstName, lastName, email, password, mobile_no } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO USERS (userID, firstName, lastName, email, passwd, mobile_no) VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    await db.query(sql, [
      userID,
      firstName,
      lastName,
      email,
      hashedPassword,
      mobile_no,
    ]);
    res.status(200).send("Created user!\n");
    // console.log(req.body);
  } catch (e) {
    res.status(500).send(e);
  }

  //   debug queries
  //   try {
  //     const data = await db.query("DESCRIBE BOOKS");
  //     console.log(data);
  //   } catch (e) {
  //     console.log(e);
  //   }
});

module.exports = router;
