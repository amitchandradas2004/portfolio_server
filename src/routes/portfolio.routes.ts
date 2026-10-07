import { Router } from 'express';
import {
  getProjects,
  createProject,
  getAdminDashboard,
  getDemoPreview,
} from '../controllers/portfolio.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles, requireAdmin, restrictDemoMutation } from '../middlewares/role.middleware';
import { UserRole } from '../constants/roles';

const router = Router();

// Public route to view projects
router.get('/projects', getProjects);

// Admin-only route to create a project
router.post('/projects', authenticateToken, requireAdmin, createProject);

// Admin-only dashboard
router.get('/admin/dashboard', authenticateToken, requireAdmin, getAdminDashboard);

// Accessible by both ADMIN and DEMO roles
router.get('/demo/preview', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.DEMO), getDemoPreview);

// Protected mutation endpoint demonstrating DEMO mode restriction
router.post('/portfolio-action', authenticateToken, authorizeRoles(UserRole.ADMIN, UserRole.DEMO), restrictDemoMutation, createProject);

export default router;
