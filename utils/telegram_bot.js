require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { messages } = require("./messages");
const db = require("../models");
const token = "6948817655:AAHhnItZLUJSDyutTyTp-V_ItbZywT0EfTY";
const telegram_bot = new TelegramBot(token, { polling: true });
const chat_id = 219632451;

async function telegram_listener() {
  try {
    telegram_bot.onText(/\/start/, async (msg) => {
      telegram_bot.sendMessage(
        msg.chat.id,
        messages.WELCOME(msg.chat.first_name)
      );
      let {
        id: chat_id,
        first_name: firstname,
        last_name: lastname,
        username,
      } = msg.chat;
      let user;
      user = await db["bot_users"].findOne({
        raw: true,
        where: {
          chat_id,
          active: 1,
        },
      });
      if (user) {
        // update logic
      } else {
        await db["bot_user"].create({
          chat_id,
          firstname,
          lastname,
          username,
          active: 1,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { telegram_bot, chat_id };
