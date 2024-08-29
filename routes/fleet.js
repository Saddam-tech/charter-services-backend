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
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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
  let { model_name, brand_name, description, seats, active, type } = req.body;
  if (!id || !username || !useruuid) {
    senderr(res, messages.USER_NOT_FOUND, null);
    return;
  }
  if (!req.file) {
    senderr(res, messages.NO_FILE, null);
    return;
  } else if (
    !model_name ||
    !brand_name ||
    !active ||
    !seats ||
    !description ||
    !type
  ) {
    senderr(res, messages.ARG_MISSING, null);
    return;
  } else {
    let file, params, uuid, command;
    file = req.file;
    uuid = generate_uuid_hash();
    params = {
      Bucket: bucket_name,
      Key: uuid,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    command = new PutObjectCommand(params);
    await s3.send(command);
    console.log("AWS-S3: File upload completed!", { params });
    await db["fleet"].create({
      model_name,
      brand_name,
      description,
      seats,
      uuid,
      active,
      type,
    });
    sendresp(res, messages.SUCCESS, 200);
  }
});

router.delete("/:uuid", auth, async function (req, res) {
  try {
    let { uuid } = req.params;
    let { id, username, uuid: useruuid } = req.decoded;
    if (!id || !username || !useruuid) {
      senderr(res, messages.USER_NOT_FOUND, null);
      return;
    }
    if (!uuid) {
      senderr(res, messages.NOT_FOUND, null);
      return;
    }
    let item = await db["fleet"].findOne({ raw: true, where: { uuid } });
    if (item) {
      const params = {
        Bucket: bucket_name,
        Key: item.uuid,
      };
      const command = new DeleteObjectCommand(params);
      s3.send(command)
        .then((data) => {
          console.log({ ["DELETE-SUCCESS"]: data });
        })
        .catch((err) => {
          if (err) {
            console.log("Error deleting data from S3:", err);
            senderr(res, messages.S3_DELETE_ERROR, 500);
          }
        });
      await db["fleet"].destroy({ where: { uuid } });
      sendresp(res, messages.DELETE_SUCCESS, 200, { uuid });
    } else {
      senderr(res, messages.NOT_FOUND, 500, { uuid });
    }
  } catch (err) {
    console.log(err);
    senderr(res, messages.ERROR, 500);
  }
});

router.put("/:uuid", auth, upload.single("file"), async function (req, res) {
  try {
    let { uuid } = req.params;
    let { id, username, uuid: useruuid } = req.decoded;
    if (!id || !username || !useruuid) {
      senderr(res, messages.USER_NOT_FOUND, null);
      return;
    }
    if (!uuid) {
      senderr(res, messages.NOT_FOUND, null);
      return;
    }
    let item = await db["fleet"].findOne({ raw: true, where: { uuid } });
    if (item) {
      try {
        if (Object.entries(req.body).length > 0) {
          for (let [key, value] of Object.entries(req.body)) {
            if (key) {
              item[key] = value;
            }
          }
          await db["fleet"].update({ ...item }, { where: { uuid } });
        }
      } catch (err) {
        senderr(res, messages.ERROR, null);
        console.log(err);
      }
    } else {
      senderr(res, messages.NOT_FOUND, null);
      return;
    }
    if (req.file) {
      let file, params, command;
      file = req.file;
      params = {
        Bucket: bucket_name,
        Key: uuid,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      command = new PutObjectCommand(params);
      await s3.send(command);
      console.log("AWS-S3: File upload completed!", { params });
    }
    sendresp(res, messages.SUCCESS, 200);
  } catch (err) {
    console.log(err);
  }
});

router.get("/all", async function (_, res) {
  try {
    let queryOptions = {
      raw: true,
      order: [["id", "DESC"]],
    };
    let response = await db["fleet"].findAll(queryOptions);
    let objectParams, objectCommand, urlToS3;
    for (let el of response) {
      objectParams = {
        Bucket: bucket_name,
        Key: el.uuid,
      };
      objectCommand = new GetObjectCommand(objectParams);
      urlToS3 = await getSignedUrl(s3, objectCommand, { expiresIn: 3600 });
      el.urlToS3 = urlToS3;
    }
    sendresp(res, messages.SUCCESS, 200, { response, count: response.length });
    return;
  } catch (err) {
    senderr(res, messages.ERROR, 500);
  }
});

router.get("/:uuid", async function (req, res) {
  try {
    const { uuid } = req.params;
    let queryOptions = {
      raw: true,
      where: { uuid },
      order: [["id", "DESC"]],
    };
    let response = await db["fleet"].findOne(queryOptions);
    let objectParams, objectCommand, urlToS3;
    objectParams = {
      Bucket: bucket_name,
      Key: response.uuid,
    };
    objectCommand = new GetObjectCommand(objectParams);
    urlToS3 = await getSignedUrl(s3, objectCommand, { expiresIn: 3600 });
    response.urlToS3 = urlToS3;
    sendresp(res, messages.SUCCESS, 200, { response, count: response.length });
    return;
  } catch (err) {
    senderr(res, messages.ERROR, 500);
  }
});

module.exports = router;
