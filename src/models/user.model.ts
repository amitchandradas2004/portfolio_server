import { ObjectId, Collection } from 'mongodb';
import bcrypt from 'bcryptjs';
import { getDb, isDbReady } from '../config/db';
import { UserRole } from '../constants/roles';

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isDemoUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const getUsersCollection = (): Collection<IUser> => {
  return getDb().collection<IUser>('users');
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  if (!isDbReady()) return null;
  return getUsersCollection().findOne({ email: email.toLowerCase() });
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  if (!isDbReady() || !ObjectId.isValid(id)) return null;
  return getUsersCollection().findOne({ _id: new ObjectId(id) });
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isDemoUser?: boolean;
}): Promise<IUser> => {
  const hashedPassword = await hashPassword(userData.password);
  const now = new Date();

  const newUser: IUser = {
    name: userData.name.trim(),
    email: userData.email.toLowerCase().trim(),
    password: hashedPassword,
    role: userData.role,
    isDemoUser: userData.isDemoUser || false,
    createdAt: now,
    updatedAt: now,
  };

  const result = await getUsersCollection().insertOne(newUser);
  newUser._id = result.insertedId;
  return newUser;
};
