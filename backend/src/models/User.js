const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address format."]
    },


password:{
type:String,
required:true
},


role:{
type:String,
enum:[
"teacher",
"student"
],
default:"student"
},


createdAt:{
type:Date,
default:Date.now
}


});


module.exports = mongoose.model(
"User",
UserSchema
);