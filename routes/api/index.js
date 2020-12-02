const router = require("express").Router();

//Requiring the js page to the right root routes
router.use("/user", require("./user.js"));
router.use("/auth", require("./auth.js"));

module.exports = router;