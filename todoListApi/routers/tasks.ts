import express from "express";
import Task from "../models/Task";
import {Error} from 'mongoose';
import User from "../models/User";
import {UserTask} from "../types";

export const tasksRouter = express.Router();

tasksRouter.get('/', async(req, res, next) => {
    try {
        const task = await Task.find().populate('user', 'username');
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
})