const messages = {
  SUCCESS: "SUCCESS",
  ARG_MISSING: "ARGUMENT MISSING!",
  NOT_FOUND: "DATA-NOT-FOUND!",
  USER_NOT_FOUND: "USER-NOT-FOUND!",
  NO_FILE: "NO-FILE-UPLOADED!",
  DUBLICATE_DATA: "DUBLICATE-DATA!",
  ADMIN_LOGIN: "ADMIN-LOGIN",
  LOGOUT: "USER-LOGOUT!",
  ERROR: "UNEXPECTED-ERROR!",

  DELETE_SUCCESS: "SUCCESSFULLY DELETED!",
  S3_DELETE_ERROR: "ERROR-DELETING-S3!",

  // order
  NEW_ORDER_SUCCESS: "NEW ORDER CREATED!",
  NEW_ORDER_ERROR: "FAILED TO CREATE NEW ORDER!",

  // telegram bot
  WELCOME: (name) => `Welcome ${name} 😃  
I will be notifying you of the orders coming in to SCHS!`,
};

module.exports = { messages };
