const { v5: uuidv5 } = require("uuid");
const db = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function createJWT({ userinfo, jfilter = {} }) {
  if (userinfo) {
  } else {
    userinfo = await db["admin-users"].findOne({
      where: { ...jfilter },
      attributes: ["id", "active", "uuid"],
      raw: true,
    });
  }

  if (!userinfo) {
    return false;
  }
  let expiresIn = "24h";
  let token = jwt.sign(
    {
      type: "JWT",
      ...userinfo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn, // : "48h", // 3h",      // expiresIn: '24h',
      issuer: "SCHS-EXPRESS-BACKEND",
    }
  );
  console.log("SECRET", process.env.JWT_SECRET);
  return {
    token,
    myinfo: userinfo,
  };
}

const create_uuid_via_namespace = (str) =>
  uuidv5(str, Array.from(Array(16).keys()));

function generaterandomstr(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
const generaterandomhex = (length) => {
  var result = "";
  var characters = "abcdef0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

module.exports = {
  create_uuid_via_namespace,
  generaterandomstr,
  generaterandomhex,
  createJWT,
};
