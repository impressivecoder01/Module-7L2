import express, { type Application, type Request, type Response } from "express"
// import {Pool} from "pg"
// import config from "./config"
import {pool } from "./db"
import config from "./config"
import { userRoute } from "./modules/user/user.route"
import { profileRoute } from "./modules/profile/profile.route"
import { authRoute } from "./modules/auth/auth.route"
import fs from "fs"
// import { initDB, pool } from "./db"
const app :Application = express()


app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({extended: true}));
app.use((req, res, next) => {
  console.log('Method - URL - Time:',req.method,req.url, Date.now());
  const log = `\nMethod -> ${req.method} - Time ->${Date.now()} - URL -> ${req.url}\n`
  fs.appendFile('logger.txt',log,(err)=> {
    console.log(err);
  })
  next();
});

app.use('/api/users', userRoute)
app.use('/api/profile', profileRoute);
app.use('/api/auth',authRoute);


app.get('/', (req : Request, res: Response) => {
  res.status(200).json({
    "message" : "express server",
    "author": "Nest Level"
  })
})







  
 

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

export default app