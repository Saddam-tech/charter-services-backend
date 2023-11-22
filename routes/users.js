const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const _ = require("lodash");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const {
  create_uuid_via_namespace,
  generaterandomhex,
} = require("../utils/util");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  let user = await db["users"].findAll({
    raw: true,
    where: {},
  });
  sendresp(res, messages.SUCCESS, null, { user });
});

module.exports = router;
