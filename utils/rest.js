const sendresp = (res, msg, code, jdata) =>
  res.status(200).send({ status: "OK", message: msg, code: code, ...jdata });

const senderrwithstatus = (res, statuscode, msg, code) =>
  res.status(statuscode).send({ status: "ERR", message: msg, code: code });

const senderr = (res, msg, code) =>
  res.status(200).send({ status: "ERR", message: msg, code: code });

const sendlist = (res, msg, code, list) =>
  res.status(200).send({ status: "OK", message: msg, code: code, list: list });

module.exports = {
  sendresp,
  senderrwithstatus,
  senderr,
  sendlist,
};
