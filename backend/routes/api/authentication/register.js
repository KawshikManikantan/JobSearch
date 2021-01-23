const express = require("express");
const router = express.Router();
const {check, validationResult} = require('express-validator')
const encryptor = require('bcryptjs')
const jwt=require('jsonwebtoken')
// Load User model
const Register = require("../../../models/Login_Details");

const configuration=require("../../../config_backend")

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
            const req_body={
                'id':newUser._id,
                'userid':newUser.email,
                'type':newUser.type,
                'prof_built':newUser.profile_built
            }
            console.log(req_body)
            res.status(200).json(req_body)

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post('/modify',async(req,res)=>{
    //Debug
    console.log("Body")
    console.log(req.body)

    //If no errors in the given input
    try {
        //Check if email is existant?
        const email = req.body.email
        const existingUser = await Register.findOneAndUpdate({email:email},{profile_built:true})
        res.status(200).end()
    }catch(err){
        console.log(err)
    }
})

router.post("/login",
    async (req, res) => {

        //Debug
        console.log("Body")
        console.log(req.body)

        //If no errors in the given input
        try {

            //Check if email is existant?
            const email=req.body.email
            const existingUser = await Register.findOne({email})
            if(!existingUser)
            {
                return res.status(401).json({ message:"User is not authenticated"})
            }

            let compare=await encryptor.compare(req.body.password,existingUser.password)
            if(!compare)
            {
                return res.status(401).json({ message:"User is not authenticated"})
            }
            console.log(existingUser.email)
            // console.log(res.session)
            const req_body={
                'id':existingUser._id,
                'userid':existingUser.email,
                'type':existingUser.type,
                'prof_built':existingUser.profile_built
            }
            console.log(req_body)
            res.status(200).json(req_body)

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

module.exports = router;

