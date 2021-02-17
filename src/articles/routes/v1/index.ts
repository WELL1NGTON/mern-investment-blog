import articlesRoutes from './articlesRoutes';
import { Router } from 'express';
import categoriesRoutes from './categoriesRoutes';

const router = Router();

router.use('/articles', articlesRoutes);
router.use('/categories', categoriesRoutes);

export default router;
