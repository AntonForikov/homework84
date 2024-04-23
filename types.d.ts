import {Model, ObjectId} from 'mongoose';

export interface UserFromDb {
  _id: ObjectId;
  username: string;
  password: string;
  token: string;
}

export interface TaskFromDb {
  _id: ObjectId;
  user: ObjectId;
  title: string;
  description: String | null;
  status: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFromDb, {}, UserMethods>