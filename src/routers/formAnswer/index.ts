import { Router } from 'express'
import { upload } from '~/configs/cloudinary.config'
import FormAnswerController from '~/controllers/formAnswer.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerFormAnswer = Router()
routerFormAnswer.post('/add-new-form-report', asyncHandler(FormAnswerController.addAnswerForm))
routerFormAnswer.post('/upload-file-answers', upload.single('file'), asyncHandler(FormAnswerController.uploadFileFormAnswer))
routerFormAnswer.post('/update-form-views', asyncHandler(FormAnswerController.increaseViewFormAnswer))

routerFormAnswer.use(authentication)
routerFormAnswer.get('/get-form-answer', asyncHandler(FormAnswerController.getFormAnswer))
routerFormAnswer.get('/get-form-view', asyncHandler(FormAnswerController.getTotalViewForm))
routerFormAnswer.get('/get-total-form-answer', asyncHandler(FormAnswerController.getTotaLAnswerForm))

export default routerFormAnswer
