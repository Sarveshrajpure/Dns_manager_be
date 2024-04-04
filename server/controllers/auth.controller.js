const { User } = require("../models/user");
const { authService, userService } = require("../services/");
const { registerSchema, loginSchema } = require("../validations/registerLoginValidations");
const httpStatus = require("http-status");
require("dotenv").config();

const authController = {
  async register(req, res, next) {
    try {
      /*  #swagger.parameters['Register params'] = {
            in: 'body',
            description: 'Json data required to register a user',
            schema: {
                firstName: 'John',
                lastName: "Doe",
                email: 'jhondoe@gmail.com',
                password:'jhondoe123'
            },
            required:true
    } */

      //validating using joi
      let value = await registerSchema.validateAsync(req.body);

      if (value) {
        //chechking if email is taken
        if (await User.emailTaken(value.email)) {
          throw new ApiError(httpStatus.BAD_REQUEST, "User already exists!");
        }

        let user = await authService.createUser(
          value.email,
          value.password,
          value.firstName,
          value.lastName
        );

        /* #swagger.responses[200] = {
            description: 'Reponsds with registered user info',
            schema:{
              "user": {
              "email": "jhondoe@gmail.com",
              "password": "$2b$10$3DMTCEG/TGwkQt6AgW7tteUlw4HmBkZ5k5z5WJzt0lKbbVLZulNwi",
              "firstName": "jhon",
              "lastName": "deo",
              "_id": "660be614ed71f2b5991db5aa",
              "createdAt": "2024-04-02T11:03:48.798Z",
              "updatedAt": "2024-04-02T11:03:48.798Z", 
               }
            }
          }
        } */

        res.status(httpStatus.CREATED).send({
          user,
        });
      }
    } catch (error) {
      next(error);
    }
  },

  async signin(req, res, next) {
    try {
      /*  #swagger.parameters['sigin params'] = {
            in: 'body',
            description: 'Json data required to register a user',
            schema: {
                firstName: 'John',
                lastName: "Doe",
                email: 'jhondoe@gmail.com',
                password:'jhondoe123'
            },
            required:true
    } */

      //validating user login data using joi
      let value = await loginSchema.validateAsync(req.body);

      if (value) {
        const user = await authService.signInEmailAndPassword(value.email, value.password);

        //setting access token
        let token = await authService.genAuthToken(user);

        /* #swagger.responses[200] = {
            description: 'Reponsds with  user info and token and sets a cookie with token',
            schema:{
              "user": {
              "email": "jhondoe@gmail.com",
              "password": "$2b$10$3DMTCEG/TGwkQt6AgW7tteUlw4HmBkZ5k5z5WJzt0lKbbVLZulNwi",
              "firstName": "jhon",
              "lastName": "deo",
              "_id": "660be614ed71f2b5991db5aa",
              "createdAt": "2024-04-02T11:03:48.798Z",
              "updatedAt": "2024-04-02T11:03:48.798Z", 
               },
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MGJlNjE0ZmU3MWYyYjU5OTFkYjVhYSIsImlhdCI6MTcxMjA2NTk1NCwiZXhwIjoxNzEyMTUyMzU0fQ.ZXY5GFTYtmT7LqgYNMM_G9nO-F6wFBea4k-lL0mVimc"
            }
        } */

        res
          .cookie("x-access-token", token, {
            expires: authService.setExpiry(1),
            sameSite: "none",
            secure: true,
          })
          .status(httpStatus.OK)
          .send({
            user,
            token,
          });
      }
    } catch (error) {
      next(error);
    }
  },
  async isauth(req, res, next) {
    try {
      let auth = req.authenticated;

      let _id = auth.id;
      let user = await userService.findUserById(_id);

      if (auth && user) {
        /* #swagger.responses[200] = {
            description: 'Reponsds with  user info',
            schema:{
              "user": {
              "email": "jhondoe@gmail.com",
              "password": "$2b$10$3DMTCEG/TGwkQt6AgW7tteUlw4HmBkZ5k5z5WJzt0lKbbVLZulNwi",
              "firstName": "jhon",
              "lastName": "deo",
              "_id": "660be614ed71f2b5991db5aa",
              "createdAt": "2024-04-02T11:03:48.798Z",
              "updatedAt": "2024-04-02T11:03:48.798Z", 
               }
            }
        } */
        res.status(httpStatus.OK).send(user);
      }
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      res.clearCookie("x-access-token").send("Logged out successfully!");
    } catch (err) {
      next(err);
    }
  },
};
module.exports = authController;
