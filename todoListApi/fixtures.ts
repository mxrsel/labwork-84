import mongoose from 'mongoose';
import User from './models/User';
import {randomUUID} from "node:crypto";
import Task from "./models/Task";
import config from "./config";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('tasks');
        await db.dropCollection('users');
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [userMarsel, userLamar] = await User.create({
       username: 'Marsel',
        password: '8686',
        token: randomUUID()
    }, {
        username: 'Lamar',
        password: '6868',
        token: randomUUID()
    });


    await Task.create({
        user: userMarsel._id,
        title: 'IELTS',
        description: 'pass IELTS',
        status: 'in_progress'

    }, {
        user: userLamar._id,
        title: 'Album',
        description: 'Announce new album',
        status: 'in_progress'
    });

    await db.close();
};

run().catch(console.error);