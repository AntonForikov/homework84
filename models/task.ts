import {Schema, model, ObjectId} from 'mongoose';
import User from './user';

const TaskSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
    validate: {
      validator: async (id: ObjectId) => User.findById(id),
      message: 'User does not exist'
    }
  },
  title: {
    type: String,
    required: true
  },
  description: String || null,
  status: {
    type: String,
    enum: ['new', 'in_progress', 'complete'],
    required: true,
    default: 'new'
  }
}, {versionKey: false});

const Task = model('task', TaskSchema);

export default Task;