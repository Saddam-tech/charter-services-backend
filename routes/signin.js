const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const { createJWT } = require("../utils/util");

/* POST admin-signin */
router.post("/signin", async function (req, res) {
  let { username, password } = req.body;
  if (!username || !password) {
    senderr(res, messages.USER_NOT_FOUND);
    return;
  }
  const accessToken = await createJWT({ jfilter: { username, password } });
  if (accessToken) {
    console.log(messages.ADMIN_LOGIN, { username, password });
    sendresp(res, messages.SUCCESS, null, accessToken);
  } else {
    console.log(messages.USER_NOT_FOUND, { username, password });
    senderr(res, messages.USER_NOT_FOUND);
  }
});

module.exports = router;
