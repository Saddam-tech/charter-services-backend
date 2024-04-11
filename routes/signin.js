const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");

/* POST admin-signin */
router.post("/signin", async function (req, res, next) {
  let { username, password } = req.body;
  console.log({ username, password });
  //   let admins = await db["users"].findAll({
  //     raw: true,
  //     where: {},
  //   });
  sendresp(res, messages.SUCCESS, null, {});
});

module.exports = router;
