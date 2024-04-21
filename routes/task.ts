import express from 'express';
import User from '../models/user';
import Task from '../models/task';
import mongoose from 'mongoose';
import auth, {Auth} from '../middleware/auth';

const taskRouter = express.Router();

taskRouter.post('/', auth, async (req: Auth, res, next) => {
  try {
    const {title, description} = req.body;
    if (title.trim() === '') return res.status(400).send({error: '"title" can not be a whitespace.'});

    const todoData = {
      user: req.user?._id,
      title: title.trim(),
      description: description ? description : null
    };

    const task= new Task(todoData);
    await task.save();

    return res.send(task);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) return res.status(400).send(e);
    next(e);
  }
});

taskRouter.get('/', (req, res, next) => {

});

export default taskRouter;