const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
        date:{
            type: Number,
            required: true,
        },

        day:{
            type: String,
            required:true
        },

        year:{
            type: Number,
            required: true,
        }
    },

    deadline: {
        date:{
            type: Number,
            required: true,
        },

        day:{
            type: String,
            required:true
        },

        year:{
            type: Number,
            required: true,
        },

        hour:{
            type: Number,
            required: true,
        },

        minute:{
            type: Number,
            required: true,
        }

    },

    skills_req:[
        {
            language:{
                type:String,
                required:true
            }
        }
    ],

    job_type:{
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
        required:true
    },

    recruiter:{
        type:Schema.Types.ObjectId,
        ref:"Job_Recruiter"
    }



});

module.exports = Job = mongoose.model("Job", Job_Details);
