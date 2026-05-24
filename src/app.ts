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







  
 

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

export default app