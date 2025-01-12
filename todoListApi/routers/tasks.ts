import express from "express";
import Task from "../models/Task";
import {Error} from 'mongoose';
import User from "../models/User";
import {TaskWithoutUser, UserTask} from "../types";

export const tasksRouter = express.Router();

tasksRouter.get('/', async(_req, res, next) => {
    try {
        const task = await Task.find().populate('user', '-_id, username');
        res.send(task);
    } catch(e) {
        next(e)
    }
});

tasksRouter.post('/', async(req, res, next) => {
    try {
        const token = req.get('Authorization');

        if(!token) {
            res.status(400).send("User token is not found");
            return
        }

        const userToken = await User.findOne({token});
        if (!userToken) {
            res.status(400).send("Wrong user token");
            return
        }

        const userTasks: UserTask = {
            user: req.body.user,
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        }

        const task = new Task(userTasks);

        await task.save();
        res.send(task);

    } catch(e) {
        if (e instanceof Error.ValidationError) {
            res.status(400).send(e);
            return
        }
        return next(e);
    }
});

tasksRouter.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.get('Authorization');

        if (!token) {
            res.status(400).send("User token is not found");
            return
        }

        const userToken = await User.findOne({token});
        if (!userToken) {
            res.status(400).send("Wrong user token");
            return
        }

        const task = await Task.findById(id);
        if (!task) {
            res.status(404).send({ error: 'Task not found' });
            return
        }

        if (task.user.toString() !== userToken._id.toString()) {
            res.status(403).send({ error: "This is not your task, please try again :)"});
            return
        }

        const updatedData: TaskWithoutUser = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
        };

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            updatedData,
            {new: true}
        );

        if (!updatedTask) {
            res.status(404).send("Task not found");
            return
        }

        res.send(updatedTask);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
             res.status(400).send(e);
             return
        }
        next(e);
    }
});
