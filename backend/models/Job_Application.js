const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Job_Details = new Schema({
    job:{
        type:Schema.Types.ObjectId,
        ref:"Job"
    },

    applicant:{
        type:Schema.Types.ObjectId,
        ref:"Job_Applicant"
    },

    status:{
        type:String,
        required:true
    },

    sop:{
        type:String,
        required:true
    }

})
