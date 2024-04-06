const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const hostedzoneRoute = require("./hostedzone.route");
const dnsRoute = require("./dns.route");

router.use("/auth", authRoute);

router.use("/hostedzone", hostedzoneRoute);

router.use("/dns", dnsRoute);

module.exports = router;
