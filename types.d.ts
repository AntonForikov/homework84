import {Model, ObjectId} from 'mongoose';

export interface User {
  _id: ObjectId;
  username: string;
  password: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<User, {}, UserMethods>