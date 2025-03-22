const express = require("express");
const router = new express.Router();
const db = require("../db").db;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

router.post("/register", async (req, res) => {
  const { userID, firstName, lastName, email, password, mobile_no } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = jwt.sign({ id: userID, email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const sql = `INSERT INTO USERS (userID, firstName, lastName, email, passwd, mobile_no, tokens) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  try {
    await db.query(sql, [
      userID,
      firstName,
      lastName,
      email,
      hashedPassword,
      mobile_no,
      JSON.stringify([token]),
    ]);
    res.status(201).send({ message: "User created!", token });
  } catch (e) {
    res.status(500).send(e);
  }

  //   debug queries
  try {
    const data = await db.query("SELECT * FROM USERS");
    console.log(data[0]);
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res) => {
  const { userID, password } = req.body;

  const sql = `SELECT * FROM USERS WHERE userID=?`;
  try {
    await db.query(sql, [userID], async (err, result) => {
      if (err) {
        return res.status(500).send({ error: "Database error" });
      }
      if (result.length === 0) {
        return res.status(401).send({ error: "Invalid credentials" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.userID, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      await db.query(
        `UPDATE USERS SET tokens=JSON_ARRAY_APPEND(tokens, $, ?)`,
        [token],
        async (error, results) => {
          if (error) {
            throw new Error(error);
          }
          console.log(results);
        }
      );

      res.status(200).send({ message: "Logged in", token });
    });
  } catch (e) {}
});

router.post("/logout", auth, async (req, res) => {
  const sql = `UPDATE USERS SET tokens=JSON_REMOVE(tokens, JSON_SEARCH(tokens, 'one', ?)) WHERE userID=?`;
  try {
    // console.log(req.token);
    await db.query(
      sql,
      [JSON.stringify([req.token]), req.user.id],
      async (err, result) => {
        if (err) {
          return res.status(500).send({ error: "Database error" });
        }
        console.log(result);
        res.status(200).send({ message: "Logged out" });
      }
    );
  } catch (e) {
    return res.status(401).send({ error: e });
  }
});

router.post("/logout/all", async (req, res) => {});

router.get("/profile", auth, async (req, res) => {});

module.exports = router;
