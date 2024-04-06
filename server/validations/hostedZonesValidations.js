const Joi = require("@hapi/joi");
const CONSTANTS = require("../constants/Constants");

const createHostedZoneSchema = Joi.object({
  Name: Joi.string().required(),
});

const deleteHostedZoneSchema = Joi.object({ id: Joi.string().required() });

module.exports = { createHostedZoneSchema, deleteHostedZoneSchema };
