const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const LoginSchema = new Schema({

	email: {
		type: String,
		required: true,
		unique: true
	},

	password: {
		type:String,
		required:true
	},

	type: {
		type:String,
		required:true
	},

	profile_built:{
		type:Boolean,
		required:true
	}
});

module.exports = Login = mongoose.model("Login", LoginSchema);
