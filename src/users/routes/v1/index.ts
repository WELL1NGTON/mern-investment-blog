import { Router } from "express";
import profilesRoutes from "./profilesRoutes";
import usersRoutes from "./usersRoutes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/profiles", profilesRoutes);

export default router;
