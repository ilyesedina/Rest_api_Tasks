const router = require("express").Router();
const task = require("../models/task");
const { verifyToken } = require("../validation");
 
//  /api/tasks/
// Create new task - post
//router.post("/", (req, res) => {
router.post("/", (req, res) => {
    const data = req.body;
    task.insertMany(data)
        .then(data => { res.status(201).send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

//  /api/tasks/
// Read all tasks - get
router.get("/", (req, res) => {
    task.find()
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

// Retrieve Tasks based on staus
router.get("/public", (req, res) => {
    const status = 'public';
    task.find({ status })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err }); })
});

// Retrieve Tasks based on staus
router.get("/private", (req, res) => {
    const status = 'private';
    task.find({ status })
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err }); })
});

// Read specific task -get
router.get("/:id", (req, res) => {
    task.findById(req.params.id)
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
});

/*
 // Read specific task from spesific user - get
router.get("/users/:id", (req, res) => {
    task.find({user: req.params.id})
        .then(data => { res.send(data); })
        .catch(err => { res.status(500).send({ message: err.message }); });
}); 
*/

// Update Task
router.put("/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    task.findByIdAndUpdate(id, req.body)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Cannot update task with id=" + id + ". Maybe task was not found!" });
            else
                res.send({ message: "Task was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating Task with id=" + id });
        });
});

// Delete Task
//router.delete("/:id", (req, res) => {
router.delete("/:id", verifyToken, (req, res) => {
    const id = req.params.id;

    task.findByIdAndRemove(id)
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
                });
            }
            else { res.send({ message: "Task was deleted successfully!" }); }
        })
        .catch(err => {
            res.status(500).send({ message: "Could not deleting Task with id=" + id });
        });
});
    


module.exports = router;