const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
// const fetch = require('node-fetch');
const { va, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// Custom Error handler
const { errorHandler } = require("../helpers/dbErrorHandling");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "rashawn.murphy23@ethereal.email",
    pass: "NHvw2M2XFNg3Tb3hSf",
  },
});

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          error: "Email is taken",
        });
      }
    });

    // Generate Token
    const token = jwt.sign(
      {
        name,
        email,
        password,
      },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: "15m",
      }
    );

    const emailData = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Account Activation link",
      html: `
                <h1>Please Click to link to activate<h1>
                <a href="${process.env.CLIENT_URL}/users/activate/${token}">${process.env.CLIENT_URL}/users/activate/${token}</a>
                <br/>
                <p>This email contain sensitive info</p>
                <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</p>
            `,
    };

    transporter.sendMail(emailData, function (err, info) {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err.message),
        });
      }

      return res.json({
        message: `Email has been sent to ${email}`,
      });
    });
  }
};

exports.activationController = (req, res) => {
  const { token } = req.body;

  if (token) {
    // Verify the token is valid or not or expired
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Expired Token. Signup again",
        });
      } else {
        // if valid save to database
        // Get name email password from token
        const { name, email, password } = jwt.decode(token);

        const user = new User({
          name,
          email,
          password,
        });

        user.save((err, user) => {
          if (err) {
            return res.status(401).json({
              error: errorHandler(err),
            });
          } else {
            return res.json({
              success: true,
              message: "Signup success",
              user,
            });
          }
        });
      }
    });
  } else {
    return res.json({
      message: "error happening please try again",
    });
  }
};

exports.loginController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User with that email does not exist, please sign up ",
        });
      }

      // Authentication
      if (!user.authenticate(password)) {
        return res.status(400).json({
          error: "Either email or password do not match",
        });
      }

      //Generate Token
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      const { _id, name, role, email } = user;
      return res.json({
        message: "Sign in Success",
        token,
        user: {
          _id,
          name,
          email,
          role,
        },
      });
    });
  }
};

exports.forgotController = (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    User.findOne(
      {
        email,
      },
      (err, user) => {
        if (err || !user) {
          return res.status(400).json({
            error: "User with that email does not exist",
          });
        }

        // if user exist
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_RESET_PASSWORD,
          {
            expiresIn: "10m",
          }
        );

        const emailData = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Password Reset link",
          html: `
                  <h1>Please Click to link to reset your password<h1>
                  <a href="${process.env.CLIENT_URL}/users/passwords/reset/${token}">${process.env.CLIENT_URL}/users/passwords/reset/${token}</a>
                  <br/>
                  <p>This email contain sensitive info</p>
                  <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</p>
              `,
        };

        return user.updateOne({
          resetPasswordLink: token
        }, (err, success) => {
          if (err) {
            return res.status(400).json({
              error: errorHandler(err)
            });
          } else {
            transporter.sendMail(emailData, function (err, info) {
              if (err) {
                console.log(err);
                return res.status(400).json({
                  error: errorHandler(err.message),
                });
              }
        
              return res.json({
                message: `Email has been sent to ${email}`,
              });
            });
          }
          
        });
      }
    );
  }
};

exports.resetController = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      error: firstError,
    });
  } else {
    if (resetPasswordLink) {
      jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function (err, decoded) {
        if (err) {
          return res.status(400).json({
            error: 'Expired link, try again'
          })
        }

        User.findOne({resetPasswordLink}, (err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Something went wrong, please try again'
            })
          }

          const updatedFields = {
            password: newPassword,
            resetPasswordLink: ''
          }

          user = _.extend(user, updatedFields);

          user.save((err, result) => {
            if(err){
              return res.status(400).json({

              })
            } 

            return res.json({
              message: 'Great! Now you can login with your new password'
            })
          })
        })
      })
    }
  }
}