import express from 'express';
import userRouter from './routes/user';
import mongoose from 'mongoose';
import config from './config';
import taskRouter from './routes/task';

const app = express();
const port = 8000;

app.use(express.json());
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

const run = async () => {
  await mongoose.connect(config.mongoose.db);

  app.listen(port, () => {
    console.log(`Server running on ${port} port.`);
  });

  process.on('exit', () => {
    mongoose.disconnect();
  });
};

void run();