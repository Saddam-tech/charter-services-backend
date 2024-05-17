const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { senderr, sendresp } = require("../utils/rest");
const db = require("../models");
const { messages } = require("../utils/messages");
const { auth } = require("../utils/authMiddleware");
const { generate_uuid_hash } = require("../utils/util");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const bucket_name = process.env.BUCKET_NAME;
const bucket_region = process.env.BUCKET_REGION;
const access_key = process.env.ACCESS_KEY;
const secret_access_key = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_access_key,
  },
  region: bucket_region,
});

router.post("/new", auth, upload.single("file"), async function (req, res) {
  let { id, username, uuid: useruuid } = req.decoded;
  let { sequence, section, active } = req.body;
  console.log({ sequence, section, active, file: req.file });
  if (!id || !username || !useruuid) {
    senderr(res, messages.USER_NOT_FOUND, null);
    return;
  }
  if (!req.file) {
    senderr(res, messages.NO_FILE, null);
    return;
  } else if (!sequence || !section || !active) {
    senderr(res, messages.ARG_MISSING, null);
    return;
  } else {
    let file, params, uuid, command;
    file = req.file;
    uuid = generate_uuid_hash();
    params = {
      Bucket: bucket_name,
      Key: uuid,
      Body: file.data,
      ContentType: file.mimetype,
    };
    command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("File upload completed!", { params });
    await db["banners"].create({
      name: req.file?.originalname,
      uuid,
      sequence,
      section,
      active,
    });
  }
});

module.exports = router;
