const messages = {
  SUCCESS: "SUCCESS",
  ARG_MISSING: "ARGUMENT MISSING!",
  NOT_FOUND: "DATA-NOT-FOUND!",
  USER_NOT_FOUND: "USER-NOT-FOUND!",
  DUBLICATE_DATA: "DUBLICATE-DATA!",
  ADMIN_LOGIN: "ADMIN-LOGIN",
  LOGOUT: "USER-LOGOUT!",

  // order
  NEW_ORDER_SUCCESS: "NEW ORDER CREATED!",
  NEW_ORDER_ERROR: "FAILED TO CREATE NEW ORDER!",

  // telegram bot
  WELCOME: (name) => `Welcome ${name} 😃  
I will be notifying you of the orders coming in to SCHS!`,
};

module.exports = { messages };
