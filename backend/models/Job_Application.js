const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Job_Application = new Schema({

    job:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Job"
    },

    applicant:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"Job_Applicant"
    },

    status:{
        type:String,
        required:true
    },

    date_accept:{
        type:Date,
        default:Date.now()
    },

    sop:{
        type:String,
        required:true
    }

})

module.exports = Application = mongoose.model("Job_Application", Job_Application);
