const express = require("express");
const router = express.Router();

//Required User Models
const Application=require("../../../models/Job_Application")
const Applicant=require("../../../models/Applicant")
const Recruiter=require("../../../models/Recruiter")

//Load authentication module
const auth = require("../authentication/auth")

router.get("/user/all",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)
        try {
            const req_applicant = await Applicant.find({email: req.session.userid}).select('_id')
            if (!req_applicant) {
                return res.status(400).json({message: "User Not Available"})
            }

            const req_details=await Application.find({applicant: req_applicant}).populate(['job','applicant'])
            return res.status(200).json(req_details)
        }
        catch(err){
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }
    })

router.post("/recruiter/job",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)
        try {
            const req_details=await Application.find({job: req.body.job_id}).populate(['job','applicant'])
            return res.status(200).json(req_details)
        }
        catch(err){
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }
    })


router.post("/user/create",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)
        try {
            const newUser = new Application(req.body)
            await newUser.save()
            res.status(200).end()
        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }
    })

router.put("/user/create",auth,
    async (req, res) => {
        //Debug Statements
        console.log("Body")
        console.log(req.body)

        try {
            //Check if job is existant and then upsert it.
            await Application.findByIdAndUpdate(req.body._id,req.body)
            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    })
