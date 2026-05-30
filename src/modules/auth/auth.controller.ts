import type { Request, Response } from "express"

const loginUser = async(req: Request, res: Response) => {
    try {
        
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }

}
export const authController = {
    loginUser,
}