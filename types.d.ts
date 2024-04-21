import {Model, ObjectId} from 'mongoose';

export interface UserFromDb {
  _id: ObjectId;
  username: string;
  password: string;
  token: string;
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFromDb, {}, UserMethods>