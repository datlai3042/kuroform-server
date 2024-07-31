import { RequestHandler, Router } from 'express'
import AuthController from '~/controllers/auth.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerAuth = Router()

routerAuth.post('/register', asyncHandler(AuthController.register))
routerAuth.post('/login', asyncHandler(AuthController.login))
routerAuth.get('/oauth/google', asyncHandler(AuthController.oAuthWithGoogle))
routerAuth.get('/oauth/github', asyncHandler(AuthController.oAuthWithGithub))

routerAuth.use(authentication)
routerAuth.post('/logout', asyncHandler(AuthController.logout))
routerAuth.get('/refresh-token', asyncHandler(AuthController.refresh_token))

export default routerAuth
