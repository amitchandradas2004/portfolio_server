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
// ABOUT SECTION CRUD OPERATIONS
// ==========================================

export const defaultAboutData = {
  badgeText: "About Me",
  title: "Crafting Digital Solutions with",
  highlightedTitle: "Passion & Precision",
  tagline: "Turning complex ideas into scalable, high-performance web realities.",
  showTagline: true,
  paragraph1:
    "Hello! I'm Amit Chandra Das, a full-stack developer passionate about building modern, scalable, and user-friendly web applications. I work with React, Next.js, TypeScript, Node.js, and MongoDB to create seamless digital experiences with clean, responsive interfaces and reliable backend systems.",
  paragraph2:
    "My journey into web development began with curiosity about how interactive applications work behind the scenes. Since then, I've built real-world projects, developed RESTful APIs, implemented authentication and authorization, integrated payment systems, and worked with databases to deliver functional, full-stack solutions.",
  paragraph3:
    "Beyond coding, I enjoy exploring modern web technologies, refining UI interactions, collaborating with other developers, and solving real-world problems through software. I value clean, maintainable code, continuous learning, and building intuitive user experiences while growing as a developer through hands-on projects and collaboration.",
  traits: [
    {
      id: "clean-arch",
      title: "Clean Architecture",
      description: "Modularity, reusability, and maintainable codebase standards.",
      iconKey: "check",
      iconColor: "text-sky-500",
      badgeBg: "bg-sky-500/10",
    },
    {
      id: "user-centric",
      title: "User-Centric Design",
      description: "Smooth micro-interactions and pixel-perfect responsiveness.",
      iconKey: "sparkles",
      iconColor: "text-purple-500",
      badgeBg: "bg-purple-500/10",
    },
  ],
  showResumeButton: true,
  resumeButtonText: "Download Resume",
  resumeUrl: "https://drive.google.com/file/d/1HHT7oDBDbTNMTAMEi9xEOqNkb_iP8vGP/view?usp=sharing",
  showContactButton: true,
  contactButtonText: "Let's Talk",
  cardRole: "Full Stack Developer",
  cardStatus: "Open to Work",
  cardStatusActive: true,
  location: "Dhaka, Bangladesh",
  timezone: "Asia/Dhaka",
  showLiveClock: true,
  experienceStartDate: "2024-04-01",
  autoCountProjects: true,
  githubUsername: "amitchandradas2004",
  stats: [
    {
      id: "experience",
      label: "Months Experience",
      value: "6+",
      sub: "Hands-on Building",
      iconKey: "terminal",
      color: "from-sky-500 to-blue-600",
      statType: "experience",
      useLiveGithubCommits: false,
    },
    {
      id: "projects",
      label: "Projects Built",
      value: "10+",
      sub: "Full-Stack & Web Apps",
      iconKey: "code",
      color: "from-blue-500 to-purple-600",
      statType: "projects",
      useLiveGithubCommits: false,
    },
    {
      id: "commits",
      label: "Git Commits",
      value: "1300+",
      sub: "Live GitHub Count",
      iconKey: "git",
      color: "from-purple-500 to-pink-600",
      statType: "github-commits",
      useLiveGithubCommits: true,
    },
    {
      id: "quality",
      label: "Code Quality",
      value: "100%",
      sub: "Clean & Maintainable",
      iconKey: "zap",
      color: "from-emerald-500 to-teal-600",
      statType: "manual",
      useLiveGithubCommits: false,
    },
  ],
  currentTechs: [
    { id: "react", name: "React", iconKey: "react", color: "text-cyan-400", enabled: true },
    { id: "nextjs", name: "Next.js", iconKey: "next", color: "text-slate-900 dark:text-white", enabled: true },
    { id: "typescript", name: "TypeScript", iconKey: "typescript", color: "text-blue-500", enabled: true },
    { id: "nodejs", name: "Node.js", iconKey: "node", color: "text-emerald-500", enabled: true },
    { id: "express", name: "Express", iconKey: "express", color: "text-slate-700 dark:text-slate-300", enabled: true },
    { id: "mongodb", name: "MongoDB", iconKey: "mongo", color: "text-emerald-600 dark:text-emerald-400", enabled: true },
    { id: "tailwind", name: "Tailwind CSS", iconKey: "tailwind", color: "text-sky-400", enabled: true },
    { id: "git", name: "Git", iconKey: "git", color: "text-orange-500", enabled: true },
  ],
  learningFocus: [
    {
      id: "ai-llms",
      title: "AI Integration & LLMs",
      desc: "Integrating intelligent agents & API workflows into web apps.",
      iconKey: "brain",
    },
    {
      id: "cloud-microservices",
      title: "Cloud & Microservices",
      desc: "Scalable serverless functions and modern container deployment.",
      iconKey: "rocket",
    },
    {
      id: "web-performance",
      title: "Web Performance",
      desc: "Optimizing Core Web Vitals, SSR, and rendering efficiency.",
      iconKey: "sparkles",
    },
  ],
};

export const getAbout = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(200).json(defaultAboutData);
      return;
    }
    const db = getDb();
    let aboutDoc = await db.collection("about").findOne({});

    let projectCount = 0;
    try {
      projectCount = await db.collection("projects").countDocuments({});
    } catch (e) {}

    const baseData = aboutDoc ? { ...defaultAboutData, ...aboutDoc } : defaultAboutData;

    if (baseData.autoCountProjects && projectCount > 0 && Array.isArray(baseData.stats)) {
      baseData.stats = baseData.stats.map((s: any) => {
        if (s.id === "projects" || s.statType === "projects") {
          return { ...s, value: projectCount + "+" };
        }
        return s;
      });
    }

    res.status(200).json({
      success: true,
      message: "About section retrieved successfully from Express backend",
      data: baseData,
      ...baseData,
    });
  } catch (error: any) {
    res.status(200).json(defaultAboutData);
  }
};

export const updateAbout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: "Database connection not ready" });
      return;
    }
    const body = req.body;
    delete body._id;
    const db = getDb();
    const updateDoc = {
      ...body,
      updatedAt: new Date(),
    };

    await db.collection("about").updateOne({}, { $set: updateDoc }, { upsert: true });

    res.status(200).json({
      success: true,
      message: "About section updated successfully in Express backend",
      data: updateDoc,
      about: updateDoc,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || "Failed to update About section" });
  }
};

export const deleteAbout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: "Database connection not ready" });
      return;
    }
    const { reset } = req.query;
    const db = getDb();

    if (reset === "true" || req.query.reset === "true") {
      await db.collection("about").updateOne(
        {},
        { $set: { ...defaultAboutData, updatedAt: new Date() } },
        { upsert: true }
      );
      res.status(200).json({
        success: true,
        message: "About section reset to default in Express backend",
        data: defaultAboutData,
        about: defaultAboutData,
      });
      return;
    }

    await db.collection("about").deleteMany({});
    res.status(200).json({
      success: true,
      message: "About section deleted in Express backend",
      data: defaultAboutData,
      about: defaultAboutData,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || "Failed to reset About section" });
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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
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
    
    const mainDoc = skillsList.find((d: any) => Array.isArray(d.categories)) || skillsList[0];
    if (mainDoc) {
      const { _id, ...rest } = mainDoc;
      res.status(200).json({
        success: true,
        count: skillsList.length,
        data: skillsList,
        ...rest,
        _id: _id?.toString(),
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: skillsList.length,
      data: skillsList,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch skills' });
  }
};

export const updateSkills = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!isDbReady()) {
      res.status(500).json({ success: false, error: 'Database connection not ready' });
      return;
    }
    const body = req.body;
    const db = getDb();
    const existingDoc = ((await db.collection('skills').findOne({})) as any) || {};
    const updateDoc: any = {
      badgeText: body.badgeText !== undefined ? body.badgeText : existingDoc.badgeText,
      title: body.title !== undefined ? body.title : existingDoc.title,
      highlightedTitle: body.highlightedTitle !== undefined ? body.highlightedTitle : existingDoc.highlightedTitle,
      description: body.description !== undefined ? body.description : existingDoc.description,
      learningBadgeText: body.learningBadgeText !== undefined ? body.learningBadgeText : existingDoc.learningBadgeText,
      learningSectionTitle: body.learningSectionTitle !== undefined ? body.learningSectionTitle : existingDoc.learningSectionTitle,
      learningSectionSubtitle: body.learningSectionSubtitle !== undefined ? body.learningSectionSubtitle : existingDoc.learningSectionSubtitle,
      categories: body.categories !== undefined ? body.categories : existingDoc.categories,
      learningItems: body.learningItems !== undefined ? body.learningItems : existingDoc.learningItems,
      updatedAt: new Date(),
    };
    delete updateDoc._id;
    await db.collection('skills').updateOne({}, { $set: updateDoc }, { upsert: true });
    res.status(200).json({
      success: true,
      message: 'Skills updated successfully in backend server',
      skills: updateDoc,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to update skills' });
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
    
    // If full skills document is provided, update or upsert
    if (body.categories && Array.isArray(body.categories)) {
      await db.collection('skills').updateOne({}, { $set: { ...body, updatedAt: new Date() } }, { upsert: true });
      res.status(201).json({ success: true, message: 'Skills document updated', skills: body });
      return;
    }

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
    const id = req.params.id as string;
    const body = req.body;
    delete body._id;
    const db = getDb();

    // Check if id matches an ObjectId or an item within categories
    try {
      await db.collection('skills').updateOne({ _id: new ObjectId(id) }, { $set: body });
    } catch {
      // If not ObjectId, update matching skill inside categories array
      await db.collection('skills').updateOne(
        { "categories.skills.id": id },
        { $set: { "categories.$[].skills.$[skill]": body } },
        { arrayFilters: [{ "skill.id": id }] }
      );
    }
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
    const id = req.params.id as string | undefined;
    const { reset } = req.query;
    const db = getDb();

    if (reset === 'true' || req.query.reset === 'true') {
      await db.collection('skills').deleteMany({});
      res.status(200).json({ success: true, message: 'Skills collection reset' });
      return;
    }

    if (id) {
      try {
        await db.collection('skills').deleteOne({ _id: new ObjectId(id) });
      } catch {
        await db.collection('skills').updateOne(
          {},
          { $pull: { "categories.$[].skills": { id } } } as any
        );
      }
    }
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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
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
    const id = req.params.id as string;
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
