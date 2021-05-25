const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let taskSchema = new Schema(
{
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private' ],
    },
   /*  user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },  */
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deadline: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("task", taskSchema);