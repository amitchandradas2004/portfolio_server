import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces';
import { getDb, isDbReady } from '../config/db';
import { ObjectId } from 'mongodb';

export const defaultHeroData = {
  greeting: "Hi, I'm",
  name: "Amit Chandra Das",
  designation: "Full-Stack Developer",
  description:
    "I build scalable and modern web applications using React, Next.js, Node.js, and MongoDB. I love creating clean user experiences and solving real-world problems through technology.",
  resumeUrl:
    "https://drive.google.com/file/d/1HHT7oDBDbTNMTAMEi9xEOqNkb_iP8vGP/view?usp=sharing",
  imageUrl: "/Amit_Image_3.png",
  githubUrl: "https://github.com/amitchandradas2004",
  linkedinUrl: "https://www.linkedin.com/in/amitchandradas2004",
  leetcodeUrl: "https://leetcode.com/u/amitchandradas2004",
  twitterUrl: "https://x.com/amitchandra2004",
  email: "amitchandradas950@gmail.com",
  techBadges: [
    { name: "React", iconKey: "react", colorClass: "text-cyan-400", enabled: true },
    { name: "Next.js", iconKey: "next", colorClass: "text-slate-900 dark:text-white", enabled: true },
    { name: "TypeScript", iconKey: "typescript", colorClass: "text-blue-500", enabled: true },
    { name: "Node.js", iconKey: "nodejs", colorClass: "text-emerald-500", enabled: true },
    { name: "MongoDB", iconKey: "mongodb", colorClass: "text-emerald-600 dark:text-emerald-400", enabled: true },
  ],
};

// ==========================================
// 1. HERO SECTION CRUD OPERATIONS
// ==========================================

export const getHero = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(200).json(defaultHeroData);
      return;
    }
    const db = getDb();
    const heroDoc = await db.collection('hero').findOne({});
    if (!heroDoc) {
      res.status(200).json(defaultHeroData);
      return;
    }
    res.status(200).json({
      greeting: heroDoc.greeting || defaultHeroData.greeting,
      name: heroDoc.name || defaultHeroData.name,
      designation: heroDoc.designation || defaultHeroData.designation,
      description: heroDoc.description || defaultHeroData.description,
      resumeUrl: heroDoc.resumeUrl || defaultHeroData.resumeUrl,
      imageUrl: heroDoc.imageUrl || defaultHeroData.imageUrl,
      githubUrl: heroDoc.githubUrl ?? defaultHeroData.githubUrl,
      linkedinUrl: heroDoc.linkedinUrl ?? defaultHeroData.linkedinUrl,
      leetcodeUrl: heroDoc.leetcodeUrl ?? defaultHeroData.leetcodeUrl,
      twitterUrl: heroDoc.twitterUrl ?? defaultHeroData.twitterUrl,
      email: heroDoc.email ?? defaultHeroData.email,
      techBadges: Array.isArray(heroDoc.techBadges) ? heroDoc.techBadges : defaultHeroData.techBadges,
      updatedAt: heroDoc.updatedAt ? new Date(heroDoc.updatedAt).toISOString() : undefined,
    });
  } catch (error: any) {
    res.status(200).json(defaultHeroData);
  }
};

export const updateHero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const body = req.body;
    const db = getDb();
    const updateDoc = {
      greeting: body.greeting,
      name: body.name,
      designation: body.designation,
      description: body.description,
      resumeUrl: body.resumeUrl,
      imageUrl: body.imageUrl,
      githubUrl: body.githubUrl,
      linkedinUrl: body.linkedinUrl,
      leetcodeUrl: body.leetcodeUrl,
      twitterUrl: body.twitterUrl,
      email: body.email,
      techBadges: body.techBadges || defaultHeroData.techBadges,
      updatedAt: new Date(),
    };

    await db.collection('hero').updateOne({}, { $set: updateDoc }, { upsert: true });

    res.status(200).json({
      success: true,
      message: 'Hero section updated successfully in Express backend',
      hero: updateDoc,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to update Hero section' });
  }
};

export const deleteHero = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const db = getDb();
    await db.collection('hero').deleteMany({});
    res.status(200).json({
      success: true,
      message: 'Hero section reset to default in Express backend',
      hero: defaultHeroData,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to reset Hero section' });
  }
};

// ==========================================
// 2. PROJECTS SECTION CRUD OPERATIONS
// ==========================================

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(200).json({ success: true, count: 0, data: [] });
      return;
    }
    const db = getDb();
    const projectsList = await db.collection('projects').find({}).toArray();
    res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      count: projectsList.length,
      data: projectsList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const body = req.body;
    const db = getDb();
    const newProject = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('projects').insertOne(newProject);

    res.status(201).json({
      success: true,
      message: 'Project created successfully in Express backend',
      data: { ...newProject, _id: result.insertedId },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to create project' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const body = req.body;
    const db = getDb();
    delete body._id;

    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...body, updatedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      message: 'Project updated successfully in Express backend',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to update project' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const db = getDb();
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully from Express backend',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to delete project' });
  }
};

// ==========================================
// 3. SKILLS SECTION CRUD OPERATIONS
// ==========================================

export const getSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(200).json({ success: true, count: 0, data: [] });
      return;
    }
    const db = getDb();
    const skillsList = await db.collection('skills').find({}).toArray();
    res.status(200).json({
      success: true,
      count: skillsList.length,
      data: skillsList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch skills' });
  }
};

export const createSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const body = req.body;
    const db = getDb();
    const result = await db.collection('skills').insertOne({ ...body, createdAt: new Date() });
    res.status(201).json({ success: true, message: 'Skill created', data: { ...body, _id: result.insertedId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const updateSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const body = req.body;
    delete body._id;
    const db = getDb();
    await db.collection('skills').updateOne({ _id: new ObjectId(id) }, { $set: body });
    res.status(200).json({ success: true, message: 'Skill updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const db = getDb();
    await db.collection('skills').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

// ==========================================
// 4. EXPERIENCES SECTION CRUD OPERATIONS
// ==========================================

export const getExperiences = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(200).json({ success: true, count: 0, data: [] });
      return;
    }
    const db = getDb();
    const expList = await db.collection('experiences').find({}).toArray();
    res.status(200).json({ success: true, count: expList.length, data: expList });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const createExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const body = req.body;
    const db = getDb();
    const result = await db.collection('experiences').insertOne({ ...body, createdAt: new Date() });
    res.status(201).json({ success: true, message: 'Experience created', data: { ...body, _id: result.insertedId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const updateExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const body = req.body;
    delete body._id;
    const db = getDb();
    await db.collection('experiences').updateOne({ _id: new ObjectId(id) }, { $set: body });
    res.status(200).json({ success: true, message: 'Experience updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const deleteExperience = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const db = getDb();
    await db.collection('experiences').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, message: 'Experience deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

// ==========================================
// 5. EDUCATION SECTION CRUD OPERATIONS
// ==========================================

export const getEducation = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(200).json({ success: true, count: 0, data: [] });
      return;
    }
    const db = getDb();
    const eduList = await db.collection('education').find({}).toArray();
    res.status(200).json({ success: true, count: eduList.length, data: eduList });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const createEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const body = req.body;
    const db = getDb();
    const result = await db.collection('education').insertOne({ ...body, createdAt: new Date() });
    res.status(201).json({ success: true, message: 'Education created', data: { ...body, _id: result.insertedId } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const updateEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const body = req.body;
    delete body._id;
    const db = getDb();
    await db.collection('education').updateOne({ _id: new ObjectId(id) }, { $set: body });
    res.status(200).json({ success: true, message: 'Education updated' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
};

export const deleteEducation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const { id } = req.params;
    const db = getDb();
    await db.collection('education').deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ success: true, message: 'Education deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message });
  }
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
