import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'

import { config } from 'dotenv'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import bodyParser from 'body-parser'
import router from './routers'
import { ErrorServer } from './type'
import MongoConnect from './db/mongo.connect'
import errorHandler from './helpers/errorHandler'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import SocketService from './services/common/Socket.service'
import { ExtendedError } from 'node_modules/socket.io/dist/namespace'
import { getCookieValueHeader, verifyAccessTokenSocket } from './utils/token.utils'
import userModel from './model/user.model'
import { Types } from 'mongoose'
import keyManagerModel from './model/keyManager.model'
import { AuthFailedError, BadRequestError } from './Core/response.error'

export type UserSocket = { [key: string]: { socket_id: string } }

config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
      cors: {
            origin: process.env.MODE === 'DEV' ? 'http://localhost:3000' : process.env.CLIENT_URL, // Cho phép truy cập từ origin này
            methods: ['GET', 'POST'], // Chỉ cho phép các phương thức GET và POST
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Chỉ
            credentials: true
      },
      cookie: true
})
global._userSocket = []
global._io = io // cach 2

MongoConnect.Connect()
app.use(helmet())
app.use(compression())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())

// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
      cors({
            origin: ['http://localhost:3000', process.env.CLIENT_URL as string],// Cho phép truy cập từ origin này
            methods: ['GET', 'POST', 'DELETE'], // Chỉ cho phép các phương thức GET và POST
            allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'], // Chỉ
            credentials: true
      })
)

global._io.use(async (socket: Socket, next: any) => {
      const clientId = getCookieValueHeader('client_id', socket.request.headers.cookie!)
      const access_token = getCookieValueHeader('access_token', socket.request.headers.cookie!)
      const user = await userModel.findOne({ _id: new Types.ObjectId(clientId) })
      if (!user) {
            return next(new BadRequestError({ metadata: 'Không tìm thấy user' }))
      }
      const foundKey = await keyManagerModel.findOne({ user_id: user?._id })

      if (!foundKey) {
            return next(new BadRequestError({ metadata: 'Không tìm thấy key' }))
      }

      const checkAuthentication = verifyAccessTokenSocket({
            user: user,
            keyStore: foundKey,
            client_id: clientId,
            token: access_token,
            key: foundKey?.public_key as string
      })
      return checkAuthentication ? next() : next(new AuthFailedError({ metadata: 'Token hết hạn' }))
})

global._io.on('connection', SocketService.connection)
app.use('', router)

app.use((error: ErrorServer, req: Request, res: Response, next: NextFunction) => {
      return errorHandler(error, req, res, next)
})

server.listen(4000, () => {
      console.log('comming', process.env.MODE)
})
