import { Response, NextFunction } from 'express';
import { AuthRequest } from '../interfaces';
import { UserRole } from '../constants/roles';

/**
 * Middleware to authorize requests based on user roles (Admin vs Demo)
 * @param allowedRoles List of roles permitted to access the route
 */
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. User authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' is not authorized to perform this action.`,
        requiredRoles: allowedRoles,
        currentRole: req.user.role,
      });
      return;
    }

    next();
  };
};

/**
 * Shortcut middleware requiring Admin role
 */
export const requireAdmin = authorizeRoles(UserRole.ADMIN);

/**
 * Middleware for Demo protection:
 * Allows DEMO role to perform GET requests (read-only), but blocks database modifications (POST, PUT, DELETE, PATCH).
 */
export const restrictDemoMutation = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role === UserRole.DEMO && req.method !== 'GET') {
    res.status(403).json({
      success: false,
      message: 'Demo Mode Active: Data modification is disabled for Demo user role. Log in as Admin for write permissions.',
      role: UserRole.DEMO,
    });
    return;
  }
  next();
};
