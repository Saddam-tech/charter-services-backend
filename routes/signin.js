const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const { createJWT } = require("../utils/util");

/* POST admin-signin */
router.post("/signin", async function (req, res) {
  let { username, password } = req.body;
  console.log({ username, password });
  const accessToken = await createJWT({ username, password });
  if (accessToken) return sendresp(res, messages.SUCCESS, null, accessToken);
  else senderr(res, messages.USER_NOT_FOUND);
});

module.exports = router;
