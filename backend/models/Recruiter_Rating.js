const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Recruiter_Rating = new Schema({

    recruiter:{
        type:Schema.Types.ObjectId,
        ref:"Job_Recruiter"
    },

    applicant:{
        type:Schema.Types.ObjectId,
        ref:"Job_Applicant"
    },

    rating:{
        type:Number,
        required:true
    },

})

module.exports = RecruiterRating = mongoose.model("RecruiterRating", Recruiter_Rating);
