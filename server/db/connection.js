const mongoose = require('mongoose');

const conn = mongoose.connect("mongodb+srv://sujal:1234@nodeexpressproject.tx8jr.mongodb.net/test?retryWrites=true&w=majority&appName=NodeExpressProject")
    .then(db => {
        console.log("Databse Connected");
        return db;
    }).catch(err => {
        console.log("Connection Error: " + err);
    })

    module.exports = conn;