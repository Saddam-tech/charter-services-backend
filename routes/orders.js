const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const _ = require("lodash");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const { v4: uuidv4 } = require("uuid");

/* GET orders listing. */
router.get("/", async function (req, res, next) {
  let user = await db["orders"].findAll({
    raw: true,
    where: {},
  });
  sendresp(res, messages.SUCCESS, null, { user });
});

/* POST to orders listing. */
router.post("/", async function (req, res, next) {
  let {
    firstname,
    lastname,
    phonenumber,
    email,
    type,
    date,
    time,
    n_ppl,
    pickup_location,
    dropoff_location,
    car_type,
    special_req,
  } = req.body;
  try {
    let user;
    user = await db["orders"].findOne({
      raw: true,
      where: {
        firstname,
        lastname,
      },
    });
    if (user) {
    } else {
      let userid = uuidv4();
      let orderid = uuidv4();
      let order = await db["orders"].create({
        active: 1,
        userid,
        orderid,
        type,
        date,
        time,
        n_ppl,
        pickup_location,
        dropoff_location,
        car_type,
        special_req,
      });
      user = await db["users"].create({
        firstname,
        lastname,
        email,
        phonenumber,
        active: 1,
        userid,
      });
      // send a telegram message here ...
      sendresp(res, messages.NEW_ORDER_SUCCESS, null, { order, user });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
