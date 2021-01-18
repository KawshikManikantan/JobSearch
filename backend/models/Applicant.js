const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Applicant = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    education: [
            {
                institute: {
                        type:String,
                        required: true
                      },

                start: {
                    type:String,
                    required:true
                },

                end: {
                    type:String,
                    required:false
                }

            }
            ],

    skills:[
        {
            type:String,
            required:true
        }
    ],

    rating:{
        type:Number,
        required:false,
        default:0
    }

});

module.exports = Job_Applicant = mongoose.model("Job_Applicant", Applicant);
