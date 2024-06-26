import express from 'express'
import cors from 'cors'
import { routes } from './app/router/router'
import globalErrorHandler from './app/middlewares/globalErrorHandler'

const app = express()

app.use(express.json())
app.use(cors())

routes(app)

app.use(globalErrorHandler)

export default app
