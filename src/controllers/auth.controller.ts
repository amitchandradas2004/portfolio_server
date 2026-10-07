import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  findUserById,
  createUser,
  comparePassword,
} from '../models/user.model';
import { env } from '../config/env.config';
import { UserRole } from '../constants/roles';
import { AuthRequest } from '../interfaces';
import { logger } from '../utils/logger';
import { isDbReady } from '../config/db';

const generateToken = (id: string, email: string, role: UserRole): string => {
  return jwt.sign({ id, email, role }, env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(503).json({ success: false, message: 'Database service unavailable' });
      return;
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email, and password are required' });
      return;
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists' });
      return;
    }

    const assignedRole = role === UserRole.ADMIN ? UserRole.ADMIN : UserRole.DEMO;

    const user = await createUser({
      name,
      email,
      password,
      role: assignedRole,
      isDemoUser: assignedRole === UserRole.DEMO,
    });

    const userId = user._id!.toString();
    const token = generateToken(userId, user.email, user.role);

    res.status(201).json({
      success: true,
      message: `User registered successfully with '${user.role}' role (Native MongoDB)`,
      data: {
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(503).json({ success: false, message: 'Database service unavailable' });
      return;
    }

    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user || !user.password) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const userId = user._id!.toString();
    const token = generateToken(userId, user.email, user.role);

    res.status(200).json({
      success: true,
      message: `Logged in successfully as ${user.role.toUpperCase()} (Native MongoDB)`,
      data: {
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isDemoUser: user.isDemoUser,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const seedInitialUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(503).json({ success: false, message: 'Database service unavailable' });
      return;
    }

    const adminEmail = 'admin@portfolio.com';
    const demoEmail = 'demo@portfolio.com';

    let adminUser = await findUserByEmail(adminEmail);
    if (!adminUser) {
      adminUser = await createUser({
        name: 'Portfolio Admin',
        email: adminEmail,
        password: 'adminpassword123',
        role: UserRole.ADMIN,
        isDemoUser: false,
      });
      logger.info('Created default Admin user: admin@portfolio.com');
    }

    let demoUser = await findUserByEmail(demoEmail);
    if (!demoUser) {
      demoUser = await createUser({
        name: 'Demo Visitor',
        email: demoEmail,
        password: 'demopassword123',
        role: UserRole.DEMO,
        isDemoUser: true,
      });
      logger.info('Created default Demo user: demo@portfolio.com');
    }

    const adminToken = generateToken(adminUser._id!.toString(), adminUser.email, adminUser.role);
    const demoToken = generateToken(demoUser._id!.toString(), demoUser.email, demoUser.role);

    res.status(200).json({
      success: true,
      message: 'Seed users initialized successfully via Native MongoDB driver',
      data: {
        admin: {
          email: adminEmail,
          password: 'adminpassword123',
          role: UserRole.ADMIN,
          token: adminToken,
        },
        demo: {
          email: demoEmail,
          password: 'demopassword123',
          role: UserRole.DEMO,
          token: demoToken,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
