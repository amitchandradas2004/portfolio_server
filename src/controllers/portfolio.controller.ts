import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces';

// In-memory sample data (to ensure functional endpoints out-of-the-box)
let projects = [
  { id: '1', title: 'Portfolio Website', category: 'Full Stack', featured: true },
  { id: '2', title: 'E-Commerce Platform', category: 'Node.js & React', featured: false },
];

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Projects retrieved successfully',
    count: projects.length,
    data: projects,
  });
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  const { title, category, featured } = req.body;
  const newProject = {
    id: (projects.length + 1).toString(),
    title: title || 'New Portfolio Project',
    category: category || 'Web Development',
    featured: Boolean(featured),
  };
  projects.push(newProject);

  res.status(201).json({
    success: true,
    message: 'Project created successfully by Admin',
    data: newProject,
  });
};

export const getAdminDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Admin Command Center',
    adminInfo: {
      userId: req.user?.id,
      email: req.user?.email,
      role: req.user?.role,
      permissions: ['ALL_PERMISSIONS', 'CREATE_PROJECT', 'UPDATE_PORTFOLIO', 'DELETE_DATA'],
    },
  });
};

export const getDemoPreview = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({
    success: true,
    message: 'Demo Mode active: Read-only access enabled for testing features.',
    demoInfo: {
      userId: req.user?.id,
      email: req.user?.email,
      role: req.user?.role,
      permissions: ['READ_ONLY_ACCESS', 'TEST_DRIVE_PORTFOLIO'],
    },
  });
};
