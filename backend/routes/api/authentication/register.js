const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator')
const encryptor = require('bcryptjs')
const jwt=require('jsonwebtoken')
// Load User model
const Register = require("../../../models/Login_Details");
const configuration=require("../../../config")

// POST request
// Add a user to db

router.post("/register",
    async (req, res) => {

        //Debug
        console.log("Body")
        console.log(req.body)

        //If no errors in the given input
        try {

            //Check if email is existant?
            const email=req.body.email
            const existingUser = await Register.findOne({email})
            if(existingUser)
            {
                console.log(existingUser)
                return res.status(400).json({ message:"Email Id already registered"})
            }

            // If not available? Create a new user

            //Encrypt the password
            const salt = await encryptor.genSalt(15)
            let encryptedpassword=await encryptor.hash(req.body.password,salt)

            //Create new user
            const newUser = new Register({
                email: req.body.email,
                password: encryptedpassword,
                type: req.body.type,
                profile_built: false
            });

            await newUser.save()

            const message={
                userdet:{
                    id:newUser.id,
                    type:newUser.type
                }
            }

            jwt.sign(message,configuration.JWT_SECRET,{expiresIn: configuration.JWT_EXPIRATION })

            res.status(200).json()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

module.exports = router;

