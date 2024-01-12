require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const token = "6948817655:AAHhnItZLUJSDyutTyTp-V_ItbZywT0EfTY";
const telegram_bot = new TelegramBot(token, { polling: true });
const chat_id = 219632451;

module.exports = { telegram_bot, chat_id };
