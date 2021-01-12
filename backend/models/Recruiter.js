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
        type:Number,
        required:true
    },

    bio:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        required:true
    }

});

module.exports = Job_Recruiter = mongoose.model("Job_Recruiter", Recruiter);
