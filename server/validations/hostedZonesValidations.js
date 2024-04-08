const Joi = require("@hapi/joi");
const CONSTANTS = require("../constants/Constants");

const createHostedZoneSchema = Joi.object({
  Name: Joi.string().required(),
  HostedZoneConfig: Joi.object({ Comment: Joi.string().allow("") }),
});

const deleteHostedZoneSchema = Joi.object({ id: Joi.string().required() });

const updateHostedZoneSchema = Joi.object({
  Id: Joi.string().required(),
  Comment: Joi.string().allow("").required(),
});
module.exports = { createHostedZoneSchema, deleteHostedZoneSchema, updateHostedZoneSchema };
