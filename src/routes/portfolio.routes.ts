import { Router } from 'express';
import {
  getHero,
  updateHero,
  deleteHero,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  getAdminDashboard,
  getDemoPreview,
} from '../controllers/portfolio.controller';

const router = Router();

// HERO SECTION CRUD
router.get('/hero', getHero);
router.put('/hero', updateHero);
router.post('/hero', updateHero);
router.delete('/hero', deleteHero);

// PROJECTS CRUD
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// SKILLS CRUD
router.get('/skills', getSkills);
router.post('/skills', createSkill);
router.put('/skills/:id', updateSkill);
router.delete('/skills/:id', deleteSkill);

// EXPERIENCES CRUD
router.get('/experiences', getExperiences);
router.post('/experiences', createExperience);
router.put('/experiences/:id', updateExperience);
router.delete('/experiences/:id', deleteExperience);

// EDUCATION CRUD
router.get('/education', getEducation);
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// DASHBOARD OVERVIEW ENDPOINTS
router.get('/admin/dashboard', getAdminDashboard);
router.get('/demo/preview', getDemoPreview);

export default router;
