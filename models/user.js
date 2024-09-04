const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/miniproject1");

const userScheama = mongoose.Schema({
    username: String,
    name: String,
    age: String,
    email: String,
    password: String,
    posts :[
        {type: mongoose.Schema.Types.ObjectId, ref:"post"}
    ]
});

module.exports = mongoose.model('user',userScheama);