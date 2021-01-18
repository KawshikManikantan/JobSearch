const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const test = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },



});

module.exports = test_col = mongoose.model("test", test);
