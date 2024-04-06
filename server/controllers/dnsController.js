const httpStatus = require("http-status");
require("dotenv").config();
const {
  Route53Client,
  ChangeResourceRecordSetsCommand,
  ListResourceRecordSetsCommand,
} = require("@aws-sdk/client-route-53");
const { dnsRecordCRUDSchema, getDnsRecordsSchema } = require("../validations/dnsValidations");
const route53Client = new Route53Client({ region: "ap-south-1" });

const dnsController = {
  async listDnsRecordsByHostedZoneId(req, res, next) {
    try {
      let values = await getDnsRecordsSchema.validateAsync(req.query);

      let dnsRecords = await route53Client.send(new ListResourceRecordSetsCommand(values));

      res.status(httpStatus.OK).send(dnsRecords);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async createDnsRecord(req, res, next) {
    try {
      let values = await dnsRecordCRUDSchema.validateAsync(req.body);

      values.ChangeBatch.Changes[0].Action = "CREATE";

      let createRecord = await route53Client.send(new ChangeResourceRecordSetsCommand(values));

      res.status(httpStatus.CREATED).send(createRecord);
    } catch (err) {
      console.log(err);
      next(err);
    }
  },
  async updateDnsRecord(req, res, next) {
    try {
      let values = await dnsRecordCRUDSchema.validateAsync(req.body);

      values.ChangeBatch.Changes[0].Action = "UPSERT";

      let updateRecord = await route53Client.send(new ChangeResourceRecordSetsCommand(values));

      res.status(httpStatus.OK).send(updateRecord);
    } catch (err) {
      next(err);
    }
  },
  async deleteDnsRecord(req, res, next) {
    try {
      let values = await dnsRecordCRUDSchema.validateAsync(req.body);

      values.ChangeBatch.Changes[0].Action = "DELETE";

      let deleteRecord = await route53Client.send(new ChangeResourceRecordSetsCommand(values));

      res.status(httpStatus.OK).send(deleteRecord);
    } catch (err) {
      next(err);
    }
  },
  async getDnsRecordsMetrics(req, res, next) {
    try {
      let values = await getDnsRecordsSchema.validateAsync(req.query);

      let getDnsRecords = await route53Client.send(new ListResourceRecordSetsCommand(values));

      let dnsRecords = getDnsRecords.ResourceRecordSets;

      let dnsRecordCount = new Map();

      for (let i = 0; i < dnsRecords.length; i++) {
        dnsRecordCount.set(dnsRecords[i].Type, 0);
      }

      for (let i = 0; i < dnsRecords.length; i++) {
        let k = dnsRecordCount.get(dnsRecords[i].Type);

        dnsRecordCount.set(dnsRecords[i].Type, k + 1);
      }

      let dnsRecordMetrics = [];
      dnsRecordCount.forEach((value, key) => {
        dnsRecordMetrics.push({ recordType: key, count: value });
      });

      res.status(httpStatus.OK).send(dnsRecordMetrics);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = dnsController;
