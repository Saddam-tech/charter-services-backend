const express = require("express");
const router = express.Router();
const { messages } = require("../utils/messages");
const { senderr, sendresp } = require("../utils/rest");
const { createJWT } = require("../utils/util");
const db = require("../models");

const { auth } = require("../utils/authMiddleware");
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

router.put("/update", auth, upload.single("file"), async (req, res) => {
  try {
    let { id, username, uuid } = req.decoded;
    if (!id || !username || !uuid) {
      senderr(res, messages.USER_NOT_FOUND, null);
      return;
    }
    let admin = await db["admin_accounts"].findOne({
      raw: true,
      where: { uuid },
      attributes: { exclude: ["password"] },
    });
    if (admin) {
      if (Object.entries(req.body).length > 0) {
        for (let [key, value] of Object.entries(req.body)) {
          if (key) {
            admin[key] = value;
          }
        }
        await db["admin_accounts"].update({ ...admin }, { where: { uuid } });
        if (admin.password) {
          delete admin.password;
        }
      }
      if (req.file) {
        let file, params, command, getObjectParams, getObjectCommand;
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
        getObjectParams = {
          Bucket: bucket_name,
          Key: uuid,
        };
        getObjectCommand = new GetObjectCommand(getObjectParams);
        admin.profileImgUrl = await getSignedUrl(s3, getObjectCommand, {
          expiresIn: 3600,
        });
      }
      sendresp(res, messages.SUCCESS, 200, { admin });
    }
  } catch (err) {
    console.log(err);
    senderr(res, messages.ERROR, 500);
  }
});

/* GET admin-info */
router.get("/info", async (_, res) => {
  try {
    const admin = await db["admin_accounts"].findAll({
      raw: true,
      attributes: { exclude: ["password"] },
    });
    if (admin.length > 0) {
      let objectParams, objectCommand, profileImgUrl;
      objectParams = {
        Bucket: bucket_name,
        Key: admin[0].uuid,
      };
      objectCommand = new GetObjectCommand(objectParams);
      profileImgUrl = await getSignedUrl(s3, objectCommand, {
        expiresIn: 3600,
      });
      admin[0].profileImgUrl = profileImgUrl;
      sendresp(res, messages.SUCCESS, 200, { admin: admin[0] });
    } else {
      senderr(res, messages.NOT_FOUND, null);
    }
  } catch (err) {
    console.log(err);
  }
});

/* POST admin-signin */
router.post("/signin", async function (req, res) {
  let { username, password } = req.body;
  if (!username || !password) {
    senderr(res, messages.USER_NOT_FOUND);
    return;
  }
  const accessToken = await createJWT({ jfilter: { username, password } });
  if (accessToken) {
    console.log(messages.ADMIN_LOGIN, { username, password });
    sendresp(res, messages.SUCCESS, 200, accessToken);
  } else {
    console.log(messages.USER_NOT_FOUND, { username, password });
    senderr(res, messages.USER_NOT_FOUND);
  }
});

module.exports = router;
