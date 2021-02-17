import v1 from './v1';
import { Router } from 'express';

const router = Router();

router.use('/v1', v1);

export default router;
