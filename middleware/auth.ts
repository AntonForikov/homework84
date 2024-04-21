import {NextFunction, Request, Response} from 'express';
import {HydratedDocument} from 'mongoose';
import {UserFromDb} from '../types';
import User from '../models/user';

export interface Auth extends Request{
  user?: HydratedDocument<UserFromDb>
}

const auth =  async (req: Auth, res: Response, next: NextFunction) => {
  const tokenData = req.get('Authorization');

  if (!tokenData) return res.status(401).send({error: 'No token provided'});

  const [_, token] = tokenData.split(' ');
  const user = await User.findOne({token});

  if (!user) return res.status(403).send({error: 'Wrong token'});

  req.user = user;
  next();
};

export default auth;