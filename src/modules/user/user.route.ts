import { Router, type Request, type Response } from "express";
import app from "../../app";
import { pool } from "../../db";
import { userController } from "./user.controller";

const router = Router()

router.post('/', userController.createUser)
router.get('/', userController.getAllUsers)
router.get(`/api/users/:id`,)

export const userRoute = router