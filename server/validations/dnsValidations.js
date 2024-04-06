const Joi = require("@hapi/joi");
const CONSTANTS = require("../constants/Constants");

const changesSchema = Joi.array()
  .items(
    Joi.object().keys({
      ResourceRecordSet: Joi.object({
        Name: Joi.string().optional().allow(""),
        Type: Joi.string().max(10).required(),
        ResourceRecords: Joi.array().items(Joi.object({ Value: Joi.string().optional() })),
        TTL: Joi.number().required(),
      }),
    })
  )
  .max(1);

const dnsRecordCRUDSchema = Joi.object({
  Name: Joi.string().required(),
  ChangeBatch: Joi.object({
    Changes: changesSchema,
  }).required(),
  HostedZoneId: Joi.string().optional().allow(""),
});

const getDnsRecordsSchema = Joi.object({
  HostedZoneId: Joi.string().required(),
  MaxItems: Joi.number().optional(),
});

module.exports = { dnsRecordCRUDSchema, getDnsRecordsSchema };
