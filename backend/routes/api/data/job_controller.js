const express = require("express");
const router = express.Router();

// Load User model
const Job = require("../../../models/Job_Details");
const Recruiter=require("../../../models/Recruiter")
const Application=require('../../../models/Job_Application')
const Applicant=require('../../../models/Applicant')
//Load authentication module
const auth = require("../authentication/auth")

// POST request
// Add a user to db

router.post("/all",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {
            // const applicant= await Applicant.findOne({email:req.body.userid})
            // if(!applicant)
            // {
            //     return res.status(400).json({ message:"No such User"})
            // }
            console.log(req.body.applicantid)
            const num_applications= await Application.countDocuments({applicant:req.body.applicantid})
            const isSelected= await Application.countDocuments({applicant:req.body.applicantid,status:"Accepted"})
            const userstatus={
                num_applications:num_applications,
                isSelected:isSelected
            }
            const existingJobs = await Job.find({}).lean().populate('recruiter')
            if(existingJobs.length!==0)
            {
                const tobesent=await Promise.all(existingJobs.map(async (job) => {
                    const num_applicants= await Application.countDocuments({job: job._id})
                    const num_selected= await Application.countDocuments({job:job._id,status:"Accepted"})
                    const status_application=await Application.findOne({job:job._id,applicant:req.body.applicantid}).select('status')
                    console.log(status_application)
                    const temp_obj={
                        num_applicants:num_applicants,
                        num_selected:num_selected,
                        app_status:(status_application||'None')
                    }
                    return({...job,...temp_obj})
                }))

                console.log(tobesent)
                return res.status(200).json({
                        userstatus:userstatus,
                        jobs:tobesent
                    }
                    )
            }

            else
            {
                const tobesent=[]
                return res.status(200).json(tobesent)
            }

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post("/create",
    async (req, res) => {
        console.log("Body")
        console.log(req.body)

        try {
            const newUser = new Job(req.body)
            await newUser.save()
            res.status(200).end()
        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });



router.put("/create",
    async (req, res) => {
        console.log("Body")
        console.log(req.body)

        try {
            //Check if job is existant and then upsert it.
            await Job.findByIdAndUpdate(req.body._id,req.body)
            const num_selected= await Application.countDocuments({job:req.body._id,status:"Accepted"})
            const num_required= await Job.findById(req.body._id).lean().select('max_positions')
            if(num_selected===num_required.max_positions)
            {
                await Application.updateMany({job:req.body._id,status:{$ne:'Accepted'}},{ $set: { status: 'Rejected' } })
            }
            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });


router.post("/details",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {

            //Check if job_id is existant?
            const existingUser = await Job.findById(req.body.job_id)

            if(!existingUser)
            {
                console.log(existingUser)
                return res.status(400).json({ message:"No such Job"})
            }

            res.status(200).json(existingUser)

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post("/me",
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {
            console.log(req.session.userid)
            // if(req.body.userid.trim()!=="recruiter@main.com")
            // {
            //     console.log("No Senses")
            // }
            const existingUser= await Recruiter.findOne({ email:req.body.userid})

            if(!existingUser)
            {
                return res.status(400).json({ message:"User Not Authenticated"})
            }

            const existingJobs = await Job.find({recruiter: existingUser}).lean()

            if(existingJobs.length!==0)
            {
                const tobesent=await Promise.all(existingJobs.map(async (job) => {
                    const num_applicants= await Application.countDocuments({job: job._id})
                    const num_selected= await Application.countDocuments({job:job._id,status:"Accepted"})
                    const temp_obj={
                        num_applicants:num_applicants,
                        num_selected:num_selected
                    }
                    return({...job,...temp_obj})
                }))
                console.log(tobesent)
                return res.status(200).json(tobesent)
            }

            else
            {
                const tobesent=[]
                return res.status(200).json(tobesent)
            }

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.post("/delete",
    async (req, res) => {
        console.log("Body of delete")
        console.log(req.body)

        try {
            //Check if email is existant?
            const existingUser = await Job.findByIdAndDelete(req.body.job_id)

            if(!existingUser)
            {
                // console.log(existingUser)
                return res.status(400).json({ message:"Element already deleted"})
            }

            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

module.exports = router;
