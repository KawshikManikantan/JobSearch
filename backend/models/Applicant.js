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
                name: {
                        type:String,
                        required: true
                      },

                startyear: {
                    type:String,
                    required:true
                },

                endyear: {
                    type:String,
                }

            }
            ],

    skills:[
        {
            language:{
                type:String,
                required:true
            }
        }
    ],

    rating:{
        type:Number,
        required:true
    }

});

module.exports = Job_Applicant = mongoose.model("Job_Applicant", Applicant);
