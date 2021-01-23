const express = require("express");
const router = express.Router();

// Load User model
const Job = require("../../../models/Job_Details");
const Recruiter=require("../../../models/Recruiter")
const Application=require('../../../models/Job_Application')
const Applicant=require('../../../models/Applicant')
const ApplicantRating=require('../../../models/Recruiter_Rating')
const JobRating=require('../../../models/Applicant_Rating')
//Load authentication module
const auth = require("../authentication/auth")

// POST request
// Add a user to db

router.post("/applicant/new",
    async (req, res) => {
        console.log("Body of delete")
        console.log(req.body)

        try {
            //Check if email is existant?
            const que = await Applicant.findById(req.body.applicant)
            // if(!res)
            // {
            //     return res.status(400).json({ message:"No user"})
            // }
            const oldrating=que.rating
            const new_rating=await Applicant.findByIdAndUpdate(req.body.applicant,{ rating:((oldrating===0)?parseInt(req.body.rating):(oldrating+parseInt(req.body.rating))/2)})
            const newUser = new ApplicantRating(req.body)
            await newUser.save()
            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post("/jobs/new",
    async (req, res) => {
        console.log("Body of delete")
        console.log(req.body)

        try {
            //Check if email is existant?
            const que = await Job.findById(req.body.job)
            // if(!res)
            // {
            //     return res.status(400).json({ message:"No user"})
            // }
            const oldrating=que.rating
            const new_rating=await Job.findByIdAndUpdate(req.body.job,{ rating:((oldrating===0)?parseInt(req.body.rating):(oldrating+parseInt(req.body.rating))/2)})
            const newUser = new JobRating(req.body)
            await newUser.save()

            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

module.exports = router;
