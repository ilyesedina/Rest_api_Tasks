const mongoose = require('mongoose');
//const { schema } = require('./task');
const Schema = mongoose.Schema;

let userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min: 6,
            max: 50
        },
        email: {
            type: String,
            required: true,
            min: 6,
            max: 70
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 200
        },
        date: {
            type: Date,
            default: Date.now
        }
    }
)

module.exports = mongoose.model("user", userSchema);