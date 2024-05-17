const { v5: uuidv5 } = require("uuid");
const db = require("../models");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const crypto = require("crypto");
// jwt authentication handlers

async function createJWT({ userinfo, jfilter = {} }) {
  if (userinfo) {
  } else {
    userinfo = await db["admin_accounts"].findOne({
      where: { ...jfilter },
      attributes: ["id", "firstname", "lastname", "username", "active", "uuid"],
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
    secretKey,
    {
      expiresIn, // : "48h", // 3h",      // expiresIn: '24h',
      issuer: "SCHS-EXPRESS-BACKEND",
    }
  );
  return {
    token,
    myinfo: userinfo,
  };
}

function verifyJWT(req, res, next) {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, userinfo) => {
    if (err) return res.sendStatus(403); // Invalid Token
    req.userinfo = userinfo;
    next();
  });
}

//

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

function generate_uuid_hash(bytes = 32) {
  crypto.randomBytes(bytes).toString("hex");
}

module.exports = {
  create_uuid_via_namespace,
  generaterandomstr,
  generaterandomhex,
  createJWT,
  verifyJWT,
  generate_uuid_hash,
};
