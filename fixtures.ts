import mongoose from 'mongoose';
import config from './config';
import User from './models/user';
import Task from './models/task';

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
  try {
    await db.dropCollection(collectionName);
  } catch (e) {
    console.log(`Collection ${collectionName} was missing, skipping drop...`);
  }
};

const collections = ['users', 'tasks'];
const run = async () => {
  await mongoose.connect(config.mongoose.db);
  const db = mongoose.connection;

  for (const collection of collections) await dropCollection(db, collection);

  const [user1, user2] = await User.create(
    {
      username: 'user1',
      password: '1',
      token: `Bearer ${crypto.randomUUID()}`
    },
    {
      username: 'user2',
      password: '2',
      token: `Bearer ${crypto.randomUUID()}`
    }
  );

  await Task.create({
      user: user1,
      title: 'First task',
      description: null
    }, {
      user: user2,
      title: 'Second task',
      description: 'task with description'
    }
  )

  await db.close();
};

void run();