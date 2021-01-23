const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ApplicationSchema=require('./Job_Application')
// Create Schema
const Job_Details = new Schema({

    title: {
        type: String,
        required: true
    },

    max_applications: {
        type: Number,
        required: true,
    },

    max_positions: {
        type: Number,
        required: true,
    },

    date_posting: {
        type: Date,
        default:Date.now()
    },

    deadline: {
        type: Date,
        required:true
    },

    skills:[
        {
            type:String,
        }
    ],

    type:{
        type:String,
        required:true
    },

    duration:{
        type: Number,
        required: true,
    },

    salary:{
        type: Number,
        required: true,
    },

    rating:{
        type:Number,
        default:0
    },

    recruiter:{
        type:Schema.Types.ObjectId,
        ref:"Job_Recruiter"
    }
});

Job_Details.pre('deleteOne',async function(next) {
    try {
        console.log("Called before deleteone")
        await ApplicationSchema.deleteMany({job: this._id})
        next()
    }catch (err) {
        console.log(err)
        // res.status(500).send('Issue with the Server.Try Again later')
        //Error Handling doubtful

    }
})

module.exports = Job = mongoose.model("Job", Job_Details);
