import express from 'express'
import cors from 'cors'
import { routes } from './app/router/router'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(cookieParser())

routes(app)

app.use(globalErrorHandler)

export default app
