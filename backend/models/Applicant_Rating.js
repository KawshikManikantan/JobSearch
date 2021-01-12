const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Applicant_Rating = new Schema({

    job:{
        type:Schema.Types.ObjectId,
        ref:"Job"
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

module.exports = ApplicantRating = mongoose.model("ApplicantRating", Applicant_Rating);
