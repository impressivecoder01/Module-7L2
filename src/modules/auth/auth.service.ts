import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt  from "jsonwebtoken"
import config from "../../config";
// import { config } from "dotenv";


const loginUserIntoDB  = async(payLoad: {email: string, password: string})=> {
    const {email, password} = payLoad;
    // check if the user exist
    // compare the password
    // generate  token
    const userData = await pool.query(
        `
        SELECT * FROM users WHERE email = $1
        `, [email], 
    );
    if(userData.rows.length === 0){
        throw new Error("User not found")
    }
    const user = userData.rows[0];
    // console.log(user);
    const matchPassword = await bcrypt.compare(password,user.password);
    if(!matchPassword){
        throw new Error("User not found")
    }
    // generate token
    const jwtPayload = {
        id: user.id,
        name: user.name,
        is_active : user.is_active,
        email: user.email
    }
    const accessToken = jwt.sign(jwtPayload,config.secret as string, {
        expiresIn: "1d"
    });
    return accessToken

}

export const authService = {
    loginUserIntoDB,
}