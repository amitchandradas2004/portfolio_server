import { Router } from 'express';
import authRoutes from './auth.routes';
import portfolioRoutes from './portfolio.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Portfolio Server is operational',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/', portfolioRoutes);

export default router;
