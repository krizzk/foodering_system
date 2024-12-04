import express from 'express'
import cors from 'cors'
import menuR from './routers/menuR' //buat baru
import userR from './routers/userR'
import orderR from "./routers/orderR";
import { log } from 'console'
import md5 from 'md5'


const PORT: number = 8000
const app = express()
app.use(cors())

app.use(`/user`,userR)
app.use(`/menu`,menuR) //buat baru
app.use(`/order`,orderR)

app.listen(PORT, () => {
    console.log(`[Server]: Server is running at http://localhost:${PORT}`);
}) 