const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const _ = require("lodash");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { telegram_bot, chat_id } = require("../utils/telegram_bot");
// const TelegramBot = require("node-telegram-bot-api");
// const token = "6948817655:AAHhnItZLUJSDyutTyTp-V_ItbZywT0EfTY";
// const telegram_bot = new TelegramBot(token, { polling: true });

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
    user = await db["users"].findOne({
      raw: true,
      where: {
        firstname,
        lastname,
        email,
        phonenumber,
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
      console.log("INSERTING INTO ORDERS, USERS TABLE...");
      console.log({ order: order.dataValues, user: user.dataValues });
      sendresp(res, messages.NEW_ORDER_SUCCESS, null, { order, user });
      // send a telegram message here ...
      telegram_bot.sendMessage(
        chat_id,
        `
        New Order: 
          type: ${type},
          Service Date: ${date},
          Service time: ${time},
          Number of people: ${n_ppl},
          Car type: ${car_type},
          Pick-up location: ${pickup_location},
          Drop-off location: ${dropoff_location},
          Firstname: ${firstname},
          Lastname: ${lastname},
          Email: ${email},
          Phone number: ${phonenumber},
          Special request: ${special_req}
        `
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
