const router = require("express").Router();

// Setting all API Routes on /api sub-routes
router.use("/api", require("./api/index.js"));

module.exports = router;