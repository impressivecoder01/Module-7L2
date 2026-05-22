import express, { type Application, type Request, type Response } from "express"
import {Pool} from "pg"
const app :Application = express()
const port = 3000

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true}))

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_5pad6WVMHnDk@ep-soft-thunder-aq1l5zgs-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDB = async() =>{
  try{
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(20),
      email VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(20) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `)
      console.log('DATABASE CONNECT successfully ');
  }
  catch(error){
    console.log(error);
  };
  
}
  initDB()


app.get('/', (req : Request, res: Response) => {
  res.status(200).json({
    "message" : "express server",
    "author": "Nest Level"
  })
})
app.post('/api/users', async(req : Request, res: Response)=>{
  // console.log(req.body);
  const {name, email, password, age} = req.body;
  
  try{
    const result = await pool.query(
    `
    INSERT INTO users (name, email, password, age) VALUES($1, $2, $3, $4)
  RETURNING *
    `, [name, email, password, age]
  )
  console.log(result);
   res.status(201).json({
    success: true,
    message : "created USER SUCCESSFULLY",
    data: result.rows[0]
  });
 
  }
  catch(error : any){
     res.status(500).json({
      success: false,
    message : error.message,
    error: error
  });
  }
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
         res.status(400).json({
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
  const result = await pool.query(`
    UPDATE users SET name = $1, password = $2, age = $3, is_active = $4
    WHERE id = $5 RETURNING *
    `, [name, password, age, is_active, id])
    // console.log(result);
    try {
      res.status(200).json({
        success: true,
        message: "users updated successfully",
        data: result.rows[0]
      })
    } catch (error: any) {
      console.log(error.message);
    }
  })
  

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})