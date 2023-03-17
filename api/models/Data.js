const mongoose = require("mongoose");

const userData = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
})

module.exports = mongoose.model('userData', userData);
