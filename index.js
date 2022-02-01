const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//import auth route
const authRoute = require('./routes/auth');

dotenv.config();

//db connect
mongoose.connect("mongodb+srv://Ashwatthama:Ashwatthama@cluster0.8n4qy.mongodb.net/NodeApp?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("connected");
    }).catch((err) => {
        console.log(err);
    });
//middleware
app.use(express.json());

//routes use
app.use('/api/user', authRoute);

app.listen(3000, () => console.log("UPNRUNNING"));