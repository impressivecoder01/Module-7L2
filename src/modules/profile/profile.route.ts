import { Router } from "express";
import { profileController } from "./porfile.controller";

const router  = Router();
router.post('/', profileController.createProfile)
export const profileRoute = router