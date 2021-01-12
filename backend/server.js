const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 4000;
const DB_NAME = "jobdb"


// routes
var testAPIRouter = require("./routes/api/testAPI");
var UserRouter = require("./routes/api/authentication/Users");
var registerUser=require("./routes/api/authentication/register")

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by');

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/' + DB_NAME, { useUnifiedTopology: true,useNewUrlParser: true,useCreateIndex: true});
mongoose.connection.once('open', function() {
    console.log("MongoDB database connection established successfully !");
})

// setup API endpoints
app.use("/testAPI", testAPIRouter);
app.use("/user", UserRouter);
app.use("/",registerUser)

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});
