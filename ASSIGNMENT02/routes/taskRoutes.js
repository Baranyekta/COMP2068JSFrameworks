// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const schedule = require('node-schedule');
const notifier = require('node-notifier');

// creating a new task
router.post('/', async (req, res) => {
    try {
        const task = await Task.create(req.body);
        // scheduling a reminder for the task deadline
        scheduleReminder(task);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// getting all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// updating a task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
        // reschedule reminder if deadline is updated
        if (req.body.deadline) {
            rescheduleReminder(task);
        }
        res.json(task);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// deleting a task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        // canceling reminder if task is deleted
        cancelReminder(id);
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// scheduling reminder for task deadline
function scheduleReminder(task) {
    const { deadline } = task;
    const reminderDate = new Date(deadline);
    const reminderJob = schedule.scheduleJob(reminderDate, () => {
        sendNotification(task);
    });
    task.reminderJobId = reminderJob.id;
    task.save();
}

// rescheduling reminder if task deadline is updated
function rescheduleReminder(task) {
    cancelReminder(task._id);
    scheduleReminder(task);
}

// canceling reminder for task
function cancelReminder(taskId) {
    const task = Task.findById(taskId);
    if (task.reminderJobId) {
        schedule.cancelJob(task.reminderJobId);
        task.reminderJobId = null;
        task.save();
    }
}

// send notif. for task reminder
function sendNotification(task) {
    const notificationMessage = `Reminder: ${task.title} is due on ${task.deadline}`;
    notifier.notify({
        title: 'AssignMate Reminder',
        message: notificationMessage,
        sound: true,
        wait: true // wait for user action before closing notif.
    });
}

module.exports = router;
