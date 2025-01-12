import express from "express";
import cors from "cors";
import {usersRouter} from "./routers/users";
import mongoose from "mongoose";
import mongoDb from "./mongoDb";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.use('/users', usersRouter);

const run = async() => {
    await mongoose.connect('mongodb://localhost/todolist');

    app.listen(port, () => {
        console.log(`Server running on port: http://localhost:${port}`);
    });

    process.on('exit', () => {
        mongoDb.disconnect();
    })
};

run().catch(err => console.error(err));