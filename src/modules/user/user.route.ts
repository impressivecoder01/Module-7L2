import { Router, type Request, type Response } from "express";
import app from "../../app";
import { pool } from "../../db";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router()

router.post('/', userController.createUser)
router.get('/',auth(), userController.getAllUsers)
router.get(`/:id`,userController.getSingleUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

export const userRoute = router