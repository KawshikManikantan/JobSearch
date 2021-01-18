const express = require("express");
const router = express.Router();

// Load User model
const Job = require("../../../models/Job_Details");
const Recruiter=require("../../../models/Recruiter")
//Load authentication module
const auth = require("../authentication/auth")

// POST request
// Add a user to db

router.get("/all",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {

            const existingUser = await Job.find({}).populate('recruiter')
                // .populate(
                // {
                //     "path":"recruiter",
                //     "match":{
                //         "email":req.session.userid
                //     }
                // }
            // )

            if(existingUser)
            {
                return res.status(200).json(existingUser)
            }

            else
            {
                return res.status(404).json({message:"No Jobs to display."})
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

router.get("/me",auth,
    async (req, res) => {

        console.log("Body")
        console.log(req.body)

        try {
            console.log(req.session.userid)
            const existingUser= await Recruiter.findOne({ email:req.session.userid}).select('_id')
            if(!existingUser)
            {
                return res.status(400).json({ message:"User Not Authenticated"})
            }

            const existingJob = await Job.find({recruiter: existingUser})

            if(existingJob)
            {
                console.log(existingUser)
                return res.status(200).json(existingJob)
            }

            else
            {
                return res.status(404).json({message:"No Job Details Found"})
            }

        } catch (err) {
            console.log(err)
            res.status(500).send('Issue with the Server.Try Again later')
        }

    });

router.delete("/delete",
    async (req, res) => {
        console.log("Body")
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
