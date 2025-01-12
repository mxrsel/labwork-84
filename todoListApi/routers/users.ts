import express from "express";
import {Error} from 'mongoose'
import User from "../models/User";

export const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateToken();

        await user.save();
        res.send(user.token);
        return;
    } catch(e) {
        if(e instanceof Error.ValidationError) {
            res.status(400).send(e);
            return
        }
        return next(e);
    }
});

usersRouter.post('/sessions', async(req, res, next) => {
try {
    const token = req.get('Authorization');

    if (!token) {
        res.status(401).send("No token provided");
        return
    }

    const existsUser = await User.findOne({username: req.body.username, token});

    if (!existsUser) {
        res.status(400).send({error: 'User is not found'});
        return
    }

    const matchPasswords = await existsUser.passwordCheckout(req.body.password);

    if (!matchPasswords) {
        res.status(401).send({error: 'Password is wrong'});
        return
    }

    existsUser.generateToken();
    await existsUser.save();

    res.send({message: 'Username and password are correct', existsUser, token});
} catch(e) {
    if(e instanceof Error.ValidationError) {
        res.status(400).send(e);
        return
        }
    return next(e);
    }
});