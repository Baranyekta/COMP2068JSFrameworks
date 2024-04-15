// models/task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    deadline: Date,
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    reminderJobId: String // store job id for scheduling reminders
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;