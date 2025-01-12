import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: {
            values: ['new', 'in_progress', 'complete'],
            message: '{value} is not a valid status'
        }
    }
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;