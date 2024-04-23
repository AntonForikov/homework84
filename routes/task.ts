import express from 'express';
import Task from '../models/task';
import mongoose from 'mongoose';
import auth, {Auth} from '../middleware/auth';
import {TaskFromDb} from '../types';

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

taskRouter.get('/', auth, async (req: Auth,res,next) => {
  try {
    const tasks: TaskFromDb[] = await Task.find({user: req.user?._id});
    if (tasks.length === 0) return res.send({success: 'User exists but he has no tasks.'})
    return res.send(tasks);
  } catch (e) {
    next(e);
  }
});

taskRouter.put('/:id', auth, async (req: Auth, res, next) => {
  try {
    const {id} = req.params;
    const targetTask = await Task.findById(id);

    if (!targetTask) return res.status(404).send({error: 'There is no such task in database'});
    if (targetTask.user.toString() !== req.user?._id.toString()) return res.status(403).send({error: 'You try to update foreign task.'});

    targetTask.title = req.body.title ? req.body.title : targetTask.title;
    targetTask.description = req.body.description ? req.body.description : targetTask.description;
    targetTask.status = req.body.status ? req.body.status : targetTask.status;

    await targetTask.save();

    return res.send(targetTask);
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError) return res.status(400).send(e);
    next(e);
  }
});

taskRouter.delete('/:id', auth, async (req: Auth, res, next) => {
  try {
    const {id} = req.params;
    const targetTask = await Task.findById(id);

    if (!targetTask) return res.status(404).send({error: 'There is no such task in database.'});
    if (targetTask.user.toString() !== req.user?._id.toString()) return res.status(403).send({error: 'You try to delete foreign task'});

    await targetTask.deleteOne();
    return res.send({success: 'Task has been deleted from database'});
  } catch (e) {
    if (e instanceof mongoose.Error.CastError) return res.status(400).send(e);
    next(e);
  }
});

export default taskRouter;