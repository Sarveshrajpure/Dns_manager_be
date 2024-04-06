const express = require("express");
const hostedZoneController = require("../controllers/hostedZone.controller");
const auth = require("../middlewares/auth");
const router = express.Router();

//api/hostedzone/lsit
router.get("/list", auth(), hostedZoneController.listHostedZones);

//api/hostedzone/create
router.post("/create", auth(), hostedZoneController.createHostedZone);

//api/hostedzone/delete
router.delete("/delete/:id", auth(), hostedZoneController.deleteHostedZone);

module.exports = router;
