const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator')
const encryptor = require('bcryptjs')
// Load User model
const User = require("../../../models/Login_Details");

// GET request 
// Getting all the users

router.get("/", function (req, res) {
    User.find(function (err, users) {
        if (err) {
            console.log(err);
        } else {
            res.json(users);
        }
    })
});

// NOTE: Below functions are just sample to show you API endpoints working, for the assignment you may need to edit them

// POST request 
// Add a user to db

router.post("/register", [check('name', 'Name is a Required Field').not().isEmpty(), check('email', 'Please enter a valid email').isEmail(), check('password', 'Minimum characters:8').isLength({min: 8})],
    async (req, res) => {
        //Debug
        console.log("Body")
        console.log(req.body)

        //Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        //If no errors in the given input
        try {
            const email=req.body.email
            const existingUser = await User.findOne({email})
            if(existingUser)
            {
                console.log(existingUser)
                return res.status(400).json({errors:[{message:"Email Id already registered"}]})
            }

        //Encrypt the password
            const salt = await encryptor.genSalt(15)
            let encryptedpassword=await encryptor.hash(req.body.password,salt)

            //Else create new user
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: encryptedpassword
            });

            const user=await newUser.save()
            res.status(200).json(user)
        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }
    });

// POST request 
// Login
router.post("/login", (req, res) => {
    const email = req.body.email;
    // Find user by email
    User.findOne({email}).then(user => {
        // Check if user email exists
        if (!user) {
            return res.status(404).json({
                error: "Email not found",
            });
        } else {
            res.send("Email Found");
            return user;
        }
    });
});

module.exports = router;

