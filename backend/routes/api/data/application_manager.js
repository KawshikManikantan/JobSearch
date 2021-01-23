const express = require("express");
const router = express.Router();

//Required User Models
const Application=require("../../../models/Job_Application")
const Applicant=require("../../../models/Applicant")
const Recruiter=require("../../../models/Recruiter")
const Job=require("../../../models/Job_Details")
const RecruiterRating=require("../../../models/Recruiter_Rating")

//Load authentication module
const auth = require("../authentication/auth")

router.post("/user/all",
    async (req, res) => {
        console.log("Body")
        console.log(req.body)
        try {
            const req_applicant = await Applicant.find({email: req.body.userid}).select('_id')
            if (!req_applicant) {
                return res.status(400).json({message: "User Not Available"})
            }
            console.log(req_applicant)
            const req_details=await Application.find({applicant: req_applicant}).lean().populate([{path:'job',model:'Job',populate: {
                    path: 'recruiter',
                    model: 'Job_Recruiter',
                }},'applicant'])
            return res.status(200).json(req_details)
        }
        catch(err){
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }
    })

router.post("/recruiter/accepted",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)
        try {
            const recr=await Recruiter.find({email:req.body.userid}).lean()
            const req_details=await Application.find({recruiter: recr._id,status: "Accepted"}).lean().populate(['job','applicant'])
            if(req_details.length===0)
            {
                return res.status(200).json(req_details)
            }
            else
            {
                const tobesent=await Promise.all(req_details.map(async (det) => {
                    const rating_details= await RecruiterRating.findOne({recruiter:det.job.recruiter,applicant:det.applicant._id}).lean()
                    if(!rating_details)
                    {
                        return({
                            ...det,
                            rating_details:'None'
                        })
                    }
                    return({
                        ...det,
                        rating_details:(rating_details)
                    })
                }))
                console.log(tobesent)
                return res.status(200).json(tobesent)
            }

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
            const req_details=await Application.find({job: req.body.job_id,status:{$ne : "Rejected"}}).lean().populate(['job','applicant'])
            return res.status(200).json(req_details)
        }
        catch(err){
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }
    })


router.post("/user/create",
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
            await Application.findByIdAndUpdate(req.body.id,req.body)
            if(req.body.status==='Accepted'){
                const num_selected= await Application.countDocuments({job:req.body.job,status:"Accepted"})
                const num_required= await Job.findById(req.body.job).lean().select('max_positions')
                if(num_selected===num_required.max_positions)
                {
                    await Application.updateMany({job:req.body.job,status:{$ne:'Accepted'}},{ $set: { status: 'Rejected' } })
                }
            }
            res.status(200).end()

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    })

module.exports = router;
