const httpStatus = require("http-status");
require("dotenv").config();
const {
  createHostedZoneSchema,
  deleteHostedZoneSchema,
  updateHostedZoneSchema,
} = require("../validations/hostedZonesValidations");
const {
  Route53Client,
  ListHostedZonesCommand,
  CreateHostedZoneCommand,
  DeleteHostedZoneCommand,
  UpdateHostedZoneCommentCommand,
} = require("@aws-sdk/client-route-53");
const route53Client = new Route53Client({ region: "ap-south-1" });

const domainController = {
  async listHostedZones(req, res, next) {
    try {
      // #swagger.description = 'Lists the hosted zones / domians, requires authentication header with jwt token'
      let getHostedZones = await route53Client.send(new ListHostedZonesCommand());

      /* #swagger.responses[200] = {
            description: 'Reponds with array of hosted zones',
            schema:[
              {
              "Id": "/hostedzone/Z0472483M6BA8LLI7PPC",
              "Name": "sanika.com.",
              "CallerReference": "1712413573670",
              "Config": {
                 "PrivateZone": false
                },
              "ResourceRecordSetCount": 7
              }
            ]
          }
        } */

      res.status(httpStatus.OK).send(getHostedZones.HostedZones);
    } catch (err) {
      next(err);
    }
  },
  async createHostedZone(req, res, next) {
    try {
      // #swagger.description = 'Create New HostedZone/Domain'
      /*  #swagger.parameters['Register params'] = {
            in: 'body',
            description: 'Json data required to create new hosted zone/domain',
            schema: {
              "Name":"sanika.com"
            },
            required:true
    } */
      let values = await createHostedZoneSchema.validateAsync(req.body);
      let createHostedZone = await route53Client.send(
        new CreateHostedZoneCommand({
          CallerReference: Date.now(),
          Name: values.Name,
          HostedZoneConfig: values.HostedZoneConfig,
        })
      );

      /* #swagger.responses[200] = {
            description: 'Reponds with array of hosted zones',
            schema:{
                "Id": "/hostedzone/Z04892861KBDULDTL2HEZ",
                "Name": "sarita.com.",
                "CallerReference": "1712423156380",
                "Config": {
                   "PrivateZone": false
                  },
                "ResourceRecordSetCount": 2
              }
        } */

      res.status(httpStatus.CREATED).send(createHostedZone.HostedZone);
    } catch (err) {
      next(err);
    }
  },

  async deleteHostedZone(req, res, next) {
    try {
      // #swagger.description = 'Deletes HostedZone/Domain'
      //  #swagger.parameters['id'] = { description: 'Hosted zone id' }
      let values = await deleteHostedZoneSchema.validateAsync(req.params);
      let deletedHostedZone = await route53Client.send(
        new DeleteHostedZoneCommand({ Id: values.id })
      );

      /* #swagger.responses[200] = {
            description: 'Response example',
            schema:{
              "$metadata": {
                 "httpStatusCode": 200,
                 "requestId": "40f4a71d-91d8-4807-9e4b-7c521f51a984",
                 "attempts": 1,
                 "totalRetryDelay": 0
                },
              "ChangeInfo": {
                 "Id": "/change/C05934751CTR9TAO1280H",
                 "Status": "PENDING",
                 "SubmittedAt": "2024-04-06T17:17:18.763Z"
                } 
            } 
        } */
      res.status(httpStatus.OK).send(deletedHostedZone);
    } catch (err) {
      next(err);
    }
  },

  async updateHostedZone(req, res, next) {
    try {
      let values = await updateHostedZoneSchema.validateAsync(req.body);

      let updatedHostedZone = await route53Client.send(new UpdateHostedZoneCommentCommand(values));

      res.status(httpStatus.OK).send(updatedHostedZone.HostedZone);
    } catch (err) {
      next(err);
    }
  },
};
module.exports = domainController;
