const express = require("express");
const router = new express.Router();
const db = require("../db").db;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const {
    userID,
    firstName,
    lastName,
    email,
    password,
    mobile_no,
    street,
    city,
    state_,
    pincode,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = jwt.sign({ id: userID, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const sql1 = `INSERT INTO USERS (userID, firstName, lastName, email, passwd, mobile_no, tokens) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const sql2 = `INSERT INTO USER_ADDRESS (addressID, userID, street, city, state_, pincode) VALUES (?, ?, ?, ?, ?, ?)`;
  try {
    await db.query(sql1, [
      userID,
      firstName,
      lastName,
      email,
      hashedPassword,
      mobile_no,
      JSON.stringify([token]),
    ]);

    await db.query(sql2, [
      userID + "__addr",
      userID,
      street,
      city,
      state_,
      pincode,
    ]);
    res.status(201).send({ message: "User created!", token });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }

  //   debug queries
  try {
    const data = await db.query("SELECT * FROM CART");
    console.log(data[0]);
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  const { userID, password } = req.body;

  const sql = `SELECT * FROM USERS WHERE userID=?`;
  try {
    const [result] = await db.query(sql, [userID]);

    if (result.length === 0) {
      return res.status(403).send({ error: "Invalid credentials" });
    }

    const user = result[0];
    const isMatch = await bcrypt.compare(password, user.passwd);

    if (!isMatch) {
      return res.status(401).send({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.userID, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const response = await db.query(
      `UPDATE USERS SET tokens=JSON_ARRAY_APPEND(tokens, '$', ?)`,
      [token]
    );

    res.status(200).send({ message: "Logged in", token });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

router.post("/logout", auth, async (req, res) => {
  const sql = `UPDATE USERS SET tokens = JSON_REMOVE(tokens, COALESCE(JSON_UNQUOTE(JSON_SEARCH(tokens, 'one', ?)), '$')) WHERE userID = ?`;
  try {
    const response = await db.query(sql, [req.token, req.user.id]);
    res.status(200).send({ message: "Logged out" });
  } catch (e) {
    return res.status(401).send({ error: e });
  }
});

router.post("/logout/all", auth, async (req, res) => {
  const sql = `UPDATE USERS SET tokens = '[]' where userID = ?`;
  try {
    const response = await db.query(sql, [req.user.id]);
    res.status(200).send({ message: "Logged out from all devices" });
  } catch (e) {
    res.status(500).send({ error: "Database error!", e });
  }
});

router.get("/profile", auth, async (req, res) => {
  const { id } = req.user;
  const sql = `SELECT * FROM USERS WHERE userID = ?`;
  try {
    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    const user = result[0];
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send({ error: "Database error!", e });
  }
});

router.get("/all", async (req, res) => {
  const sql = `SELECT * FROM USERS`;
  try {
    const [results] = await db.query(sql);
    res.status(200).send({ results });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

router.patch("/update", auth, async (req, res) => {
  const { id } = req.user;
  const updates = req.body;
  const allowedUpdates = ["email", "passwd", "mobile_no"];

  try {
    const fields = Object.keys(updates).filter(field =>
      allowedUpdates.includes(field)
    );
    var values = Object.values(updates);

    if (fields.length === 0) {
      throw new Error({ error: "No valid fields to update" });
    }

    if (fields.includes("passwd")) {
      const hashedPassword = await bcrypt.hash(updates.passwd, 10);
      values[fields.indexOf("passwd")] = hashedPassword;
    }

    const setClause = fields.map(field => `${field}=?`).join(", ");
    const sql = `UPDATE USERS SET ${setClause} WHERE userID = ?`;

    const result = await db.query(sql, [...values, id]);
    if (result.length === 0) {
      return res.status(404).send({ error: "User not found" });
    }
    console.log(result);
    res.status(200).send({ message: "User updated" });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

router.delete("/delete", auth, async (req, res) => {
  const { id } = req.user;
  const sql = `DELETE FROM USERS where userID = ?`;
  try {
    const response = await db.query(sql, [id]);
    res.status(200).send({ message: "User deleted" });
  } catch (e) {
    res.status(500).send({ error: "Database error", e });
  }
});

module.exports = router;
