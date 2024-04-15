// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const schedule = require("node-schedule");
const notifier = require("node-notifier");

// route for creating a new task
router.post("/", async (req, res) => {
  try {
    // create a new task
    const task = await Task.create(req.body);
    // schedule a reminder for the task deadline
    scheduleReminder(task);
    // send response with the created task
    res.status(201).json(task);
  } catch (err) {
    // handle errors
    res.status(400).json({ message: err.message });
  }
});

// route for getting all tasks
router.get("/", async (req, res) => {
  try {
    // retrieve all tasks
    const tasks = await Task.find();
    // send response with tasks
    res.json(tasks);
  } catch (err) {
    // handle errors
    res.status(500).json({ message: err.message });
  }
});

// route for updating a task
router.put("/:id", async (req, res) => {
  try {
    // extract task id from request parameters
    const { id } = req.params;
    // update the task with the given id
    const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
    // reschedule reminder if deadline is updated
    if (req.body.deadline) {
      rescheduleReminder(task);
    }
    // send response with the updated task
    res.json(task);
  } catch (err) {
    // handle errors
    res.status(400).json({ message: err.message });
  }
});

// route for deleting a task
router.delete("/:id", async (req, res) => {
  try {
    // extract task id from request parameters
    const { id } = req.params;
    // delete the task with the given id
    await Task.findByIdAndDelete(id);
    // cancel reminder if task is deleted
    cancelReminder(id);
    // send success message
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    // handle errors
    res.status(400).json({ message: err.message });
  }
});

// function to schedule reminder for task deadline
function scheduleReminder(task) {
  // extract deadline from the task
  const { deadline } = task;
  // convert deadline to date object
  const reminderDate = new Date(deadline);
  // schedule a job to send reminder notification
  const reminderJob = schedule.scheduleJob(reminderDate, () => {
    // call function to send notification
    sendNotification(task);
  });
  // save reminder job id in the task document
  task.reminderJobId = reminderJob.id;
  // save the task
  task.save();
}

// function to reschedule reminder if task deadline is updated
function rescheduleReminder(task) {
  // cancel existing reminder job
  cancelReminder(task._id);
  // schedule new reminder
  scheduleReminder(task);
}

// function to cancel reminder for a task
function cancelReminder(taskId) {
  // find the task by id
  const task = Task.findById(taskId);
  // check if reminder job id exists
  if (task.reminderJobId) {
    // cancel the reminder job
    schedule.cancelJob(task.reminderJobId);
    // remove reminder job id from task document
    task.reminderJobId = null;
    // save the task
    task.save();
  }
}

// function to send notification for task reminder
function sendNotification(task) {
  // compose notification message
  const notificationMessage = `Reminder: ${task.title} is due on ${task.deadline}`;
  // send notification
  notifier.notify({
    title: "AssignMate Reminder",
    message: notificationMessage,
    sound: true,
    wait: true, // wait for user action before closing notification
  });
}

// export the router
module.exports = router;
