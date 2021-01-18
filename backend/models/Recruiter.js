const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Recruiter = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    contact:{
        type:String,
        required:true
    },

    bio:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        default:0
    }

});

module.exports = Job_Recruiter = mongoose.model("Job_Recruiter", Recruiter);
