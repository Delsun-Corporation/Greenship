

const User = require('../models/auth.model');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const {OAuth2Client} = require('google-auth-library');
// const fetch = require('node-fetch');
const {va, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
// Custom Error handler
const {errorHandler} = require('../helpers/dbErrorHandling');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'rashawn.murphy23@ethereal.email',
        pass: 'NHvw2M2XFNg3Tb3hSf'
    }
})

exports.registerController = (req, res) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const firstError = errors.array().map(error => error.msg)[0]
        return res.status(422).json({
            error: firstError
        })
    } else {
        User.findOne({
            email
        }).exec((err, user) => {
            if (user) {
                return res.status(400).json({
                    error: "Email is taken"
                })
            }
        })
        
        // Generate Token
        const token = jwt.sign(
            {
                name,
                email,
                password
            },
            process.env.JWT_ACCOUNT_ACTIVATION,
            {
                expiresIn: '15m'
            }
        );

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Account Activation link',
            html: `
                <h1>Please Click to link to activate<h1>
                <p>${process.env.CLIENT_URL}/users/activate/${token}</p>
                <br/>
                <p>This email contain sensitive info</p>
                <p>${process.env.CLIENT_URL}</p>
            `
        }

        transporter.sendMail(emailData, function (err, info) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            
            return res.json({
                message: `Email has been sent to ${email}`
            })
        })
    }
};

exports.activationController = (req, res) => {
    const { token } = req.body;

    if(token) {
        // Verify the token is valid or not or expired
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    error: 'Expired Token. Signup again'
                })
            } else {
                // if valid save to database 
        // Get name email password from token
        const {name, email, password} = jwt.decode(token)

        const user = new User({
            name,
            email,
            password
        })

        user.save((err, user) => {
            if(err) {
                return res.status(401).json({
                    error: errorHandler(err)
                })
            } else {
                return res.json({
                    success: true,
                    message: 'Signup success',
                    user
                })
            }
        })
            }
        });
    } else {
        return res.json({
            message: 'error happening please try again'
        })
    }
}