const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  try {
    console.log({ token: req.headers.authorization });
    jwt.verify(
      `${req.headers.authorization}`,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          throw err;
        }
        req.decoded = decoded;
        return next();
      }
    );
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError") {
      //			LOGGER( `TokenExpiredError`) ; return next()
      return res.status(419).json({
        code: 419,
        message: "Token Expired.",
      });
    }
    if (error.name === "JsonWebTokenError") {
      //		LOGGER( `JsonWebTokenError`) ; return next()
      return res.status(401).json({
        code: 401,
        message: "Token Invalid.",
      });
    }
  }
};
