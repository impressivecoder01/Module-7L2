import express, { type Application, type Request, type Response } from "express"
// import {Pool} from "pg"
// import config from "./config"
import {pool } from "./db"
import config from "./config"
import { userRoute } from "./modules/user/user.route"
// import { initDB, pool } from "./db"
const app :Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true}))

app.use('/api/users', userRoute)


app.get('/', (req : Request, res: Response) => {
  res.status(200).json({
    "message" : "express server",
    "author": "Nest Level"
  })
})


app.get('/api/users', async(req: Request, res: Response)=> {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `)
      res.status(200).json({
        success: true,
        message: "users retrieved successfully",
        data: result.rows
      })
  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: error.message,
        data: error
      })
  }
})

app.get(`/api/users/:id`,async(req: Request, res: Response)=> {
  const {id} = req.params
  // console.log(id)
  try {
    const result = await pool.query(`
      SELECT * FROM users WHERE id=$1

      `, [id])
      if(result.rows.length===0){
         res.status(404).json({
        success: false,
        message: 'user not found',
        data: {}
      })
      }
      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result.rows[0]
      })
      // console.log(result);
  } catch (error: any) {
    res.status(500).json({
        success: false,
        message: error.message,
        data: error
      })
  }
}
)
app.put('/api/users/:id', async(req: Request, res: Response)=> {
  const {id} = req.params
  const {name, password, age, is_active} = req.body
  // console.log(id,name,age,password,is_active);
  // const result = await pool.query(`
  //   UPDATE users SET name = $1, password = $2, age = $3, is_active = $4
  //   WHERE id = $5 RETURNING *
  //   `, [name, password, age, is_active, id])
    // console.log(result);
    try {
      const result = await pool.query(`
    UPDATE users 
    SET 
    name = COALESCE($1,name), 
    password = COALESCE($2,password), 
    age = COALESCE($3,age), 
    is_active = COALESCE($4,is_active)
    WHERE id=$5 RETURNING *
    `, [name, password, age, is_active, id])

    if(result.rows.length === 0){
       res.status(404).json({
        success: false,
        message: "User not found!",
        data: {}
       })
    }
      res.status(200).json({
        success: true,
        message: "users updated successfully",
        data: result.rows[0]
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: error
      })
    }
  })
  
  app.delete('/api/users/:id', async(req: Request, res: Response)=>{
    const {id} = req.params;
    try {
      const result = await pool.query(`
        DELETE FROM users WHERE id = $1
        `,[id]);
        if(result.rowCount === 0){
          res.status(404).json({
        success: false,
        message: "User not found!",
        data: {}
       })
        }
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
          data: {}
        })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: error
      })
    }
  })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

export default app