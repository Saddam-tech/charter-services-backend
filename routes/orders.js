const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const _ = require("lodash");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const { v4: uuidv4 } = require("uuid");
const { auth } = require("../utils/authMiddleware");
const { supportedOrderStats } = require("../utils/constants");
// const { telegram_bot, chat_id } = require("../utils/telegram_bot");
// const TelegramBot = require("node-telegram-bot-api");
// const token = "6948817655:AAHhnItZLUJSDyutTyTp-V_ItbZywT0EfTY";
// const telegram_bot = new TelegramBot(token, { polling: true });

/* POST modify order status */
router.put("/status-update", auth, async function (req, res, next) {
  try {
    let { orderid, status } = req.body;
    let { id, username, uuid: useruuid } = req.decoded;
    if (!orderid || !status) {
      senderr(res, messages.NOT_FOUND, null);
      return;
    }
    if (!id || !username || !useruuid) {
      senderr(res, messages.NO_ADMIN_PRIVILEGE, null);
      return;
    }
    let order = await db["orders"].findOne({ raw: true, where: { orderid } });
    const isStatusSupported = supportedOrderStats.includes(parseInt(status));
    if (isStatusSupported) {
      if (order) {
        await db["orders"].update({ status }, { where: { orderid } });
        sendresp(res, messages.SUCCESS, 200, { orderid });
      } else {
        senderr(res, messages.NOT_FOUND, null);
      }
    } else {
      senderr(res, messages.UNSUPPORTED_ORDER_STATUS, null);
    }
  } catch (err) {
    senderr(res, messages.ERROR, 500);
  }
});

/* GET orders listing. */
router.get("/", async function (req, res, next) {
  try {
    let queryParams = {};
    if (Object.entries(req.query).length > 0) {
      for (let [key, value] of Object.entries(req.query)) {
        queryParams[key] = value;
      }
    }
    let orders = await db["orders"].findAll({
      raw: true,
      where: { ...queryParams },
    });
    let users = [];
    for (let [index, el] of orders.entries()) {
      users[index] = db["users"].findOne({
        raw: true,
        where: { userid: el.userid },
        attributes: { exclude: ["createdat", "updatedat"] },
      });
    }
    users = await Promise.all(users);
    orders = orders.map((el, i) =>
      el.userid === users[i].userid ? { ...el, ...users[i] } : el
    );
    sendresp(res, messages.SUCCESS, null, { orders });
  } catch (err) {
    senderr(res, messages.ERROR, 500);
  }
});

/* GET specific order */
router.get("/order/:orderid", async function (req, res, next) {
  try {
    let { orderid } = req.params;
    if (!orderid) {
      senderr(res, messages.ARG_MISSING, 401);
      return;
    }
    let order = await db["orders"].findOne({
      raw: true,
      where: { orderid },
    });
    let user = {};
    if (order) {
      user = await db["users"].findOne({
        raw: true,
        where: { userid: order.userid },
        attributes: { exclude: ["createdat", "updatedat"] },
      });
    }
    sendresp(res, messages.SUCCESS, null, { order: { ...order, ...user } });
  } catch (err) {
    senderr(res, messages.ERROR, 500);
  }
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
      // telegram_bot.sendMessage(
      //   chat_id,
      //   `
      //   New Order:
      //     type: ${type},
      //     Service Date: ${date},
      //     Service time: ${time},
      //     Number of people: ${n_ppl},
      //     Car type: ${car_type},
      //     Pick-up location: ${pickup_location},
      //     Drop-off location: ${dropoff_location},
      //     Firstname: ${firstname},
      //     Lastname: ${lastname},
      //     Email: ${email},
      //     Phone number: ${phonenumber},
      //     Special request: ${special_req}
      //   `
      // );
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:orderId", auth, async (req, res) => {
  try {
    let { orderId } = req.params;
    let { id, username, uuid: useruuid } = req.decoded;
    if (!id || !username || !useruuid) {
      senderr(res, messages.USER_NOT_FOUND, null);
      return;
    }
    if (!orderId) {
      senderr(res, messages.NOT_FOUND, null);
      return;
    }
    let order = await db["orders"].findOne({ raw: true, where: { orderId } });
    if (order) {
      db["deleted_orders"]
        .create({ ...order })
        .then(async () => {
          await db["orders"].destroy({ where: { orderId } });
          sendresp(res, messages.DELETE_SUCCESS, 200, { orderId });
        })
        .catch((err) => {
          console.log(err);
          senderr(res, messages.ERROR, 500);
        });
    } else {
      senderr(res, messages.NOT_FOUND, null);
      return;
    }
  } catch (err) {
    console.log(err);
    senderr(res, messages.ERROR, 500);
  }
});

module.exports = router;
