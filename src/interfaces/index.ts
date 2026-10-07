import { Request } from 'express';
import { UserRole } from '../constants/roles';

export interface IUserTokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: IUserTokenPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
