const session=require('cookie-session')
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
const DB_NAME = "jobdb"
const configuration=require("./config_backend")
//Import Session Requirements


// routes
var testAPIRouter = require("./routes/api/testAPI");
var UserRouter = require("./routes/api/authentication/Users");
var registerUser=require("./routes/api/authentication/register")
var profilebuilder=require("./routes/api/data/profile_builder.js")
var jobcontroller=require("./routes/api/data/job_controller.js")
var applicationmanager=require('./routes/api/data/application_manager.js')
var ratingmanager=require('./routes/api/data/rating_manager')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Disable Express Usage
app.disable('x-powered-by');


// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true});
mongoose.connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

mongoose.set('useFindAndModify', false);

app.use(session({
    name: 'session',
    keys: ['kawshik','manikantan'],
    // Cookie Options
    maxAge: 2 * 60 * 60 * 1000 // 2 hours
}))

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/auth",registerUser)
app.use("/profile",profilebuilder)
app.use("/job",jobcontroller)
app.use("/appl",applicationmanager)
app.use("/rate",ratingmanager)
app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
