const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
});

const Test = mongoose.model('Test', TestSchema);
module.exports = Test; 
