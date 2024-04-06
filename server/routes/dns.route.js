const express = require("express");
const dnsController = require("../controllers/dnsController");
const auth = require("../middlewares/auth");
const router = express.Router();

// api/dns/listdnsrecords
router.get("/listdnsrecords", auth(), dnsController.listDnsRecordsByHostedZoneId);

// api/dns/getdnsrecordmetrics

router.get("/getdnsrecordmetrics", auth(), dnsController.getDnsRecordsMetrics);

//api/dns/create
router.post("/create", auth(), dnsController.createDnsRecord);

//api/dns/update
router.put("/update", auth(), dnsController.updateDnsRecord);

//api/dns/delete
router.post("/delete", auth(), dnsController.deleteDnsRecord);

module.exports = router;
