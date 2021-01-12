const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator')
const encryptor = require('bcryptjs')
// Load User model
const Register = require("../../../models/Login_Details");

// POST request
// Add a user to db

router.post("/login",
    async (req, res) => {

        //Debug
        console.log("Body")
        console.log(req.body)

        //If no errors in the given input
        try {

            //Check if email is existant?
            const email=req.body.email
            const existingUser = await User.findOne({email})
            if(!existingUser)
            {
                return res.status(400).json({ message:"User is not authenticated"})
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

            const user=await newUser.save()
            res.status(200).json(user)

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

module.exports = router;

