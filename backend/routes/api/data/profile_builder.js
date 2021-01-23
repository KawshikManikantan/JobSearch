const express = require("express");
const router = express.Router();

// Load User model
const Applicant = require("../../../models/Applicant");
const Recruiter = require("../../../models/Recruiter");
const test=require("../../../models/test")


//Load authentication module
const auth = require("../authentication/auth")

// POST request
// Add a user to db

// router.get("/applicant/me",auth,
//     async (req, res) => {
//
//         console.log("Body")
//         console.log(req.body)
//
//         try {
//
//             const existingUser = await Applicant.findOne({ email:req.body.userid })
//
//             if(existingUser)
//             {
//                 console.log(existingUser)
//                 return res.status(200).json(existingUser)
//             }
//
//             else
//             {
//                 return res.status(404).json({message:"No User Details Found"})
//             }
//
//         } catch (err) {
//             console.log(err)
//             res.status(500).send('Issue with the Server.Try Again later')
//         }
//
//     });

router.post("/recruiter/me",
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {

            const existingUser = await Recruiter.findOne({ email:req.body.userid })

            if(existingUser)
            {
                console.log(existingUser)
                return res.status(200).json(existingUser)
            }

            else
            {
                return res.status(404).json({message:"No User Details Found"})
            }

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post("/applicant/me",
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {

            const existingUser = await Applicant.findOne({ email:req.body.userid }).lean()

            if(existingUser)
            {
                console.log(existingUser)
                return res.status(200).json(existingUser)
            }

            else
            {
                return res.status(404).json({message:"No User Details Found"})
            }

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post("/applicant",
    async (req, res) => {
        console.log("Body")
        console.log(req.body)

        try {
            //Check if email is existant?
            const email=req.body.email
            const existingUser = await Applicant.countDocuments({email:email})

            if(existingUser)
            {
                console.log(existingUser)
                return res.status(400).json({ message:"User already exists.Please update not create"})
            }
            
            const newUser = new Applicant(req.body)
            await newUser.save()
            
            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });


router.put("/applicant",
    async (req, res) => {
        console.log("Body")
        console.log(req.body)

        try {
            //Check if email is existant?
            const existingUser = await Applicant.findOneAndUpdate({email:req.body.email},req.body)

            if(!existingUser)
            {
                // console.log(existingUser)
                return res.status(400).json({ message:"User does not exist?"})
            }
            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });


router.post("/recruiter",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {

            //Check if email is existant?
            const email=req.body.email
            const existingUser = await Recruiter.findOne({email:req.session.userid})

            if(existingUser)
            {
                console.log(existingUser)
                return res.status(400).json({ message:"User already exists.Please update not create"})
            }

            const newUser = new Recruiter(req.body)
            await newUser.save()

            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.put("/recruiter",
    async (req, res) => {
        console.log("Body")
        console.log(req.body)

        try {
            //Check if email is existant?
            const existingUser = await Recruiter.findOneAndUpdate({email:req.session.userid},req.body)

            if(!existingUser)
            {
                // console.log(existingUser)
                return res.status(400).json({ message:"User does not exist?"})
            }

            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });
module.exports = router;
