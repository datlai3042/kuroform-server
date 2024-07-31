import { RequestHandler, Router } from 'express'
import { upload } from '~/configs/cloudinary.config'
import FormController from '~/controllers/form.controller'
import { asyncHandler } from '~/helpers/asyncHandler'
import authentication from '~/middlewares/authentication'

const routerForm = Router()
routerForm.get('/get-form-guess', asyncHandler(FormController.getFormGuess))
routerForm.get('/get-all-form', asyncHandler(FormController.getAllForm))

routerForm.use(authentication)
routerForm.get('/get-forms', asyncHandler(FormController.getForms))
routerForm.get('/search', asyncHandler(FormController.getSearchForm))

routerForm.get('/get-form-id', asyncHandler(FormController.getFormId))
routerForm.get('/info-form-notification', asyncHandler(FormController.getInfoFormNotification))
routerForm.get('/find-form', asyncHandler(FormController.getFormUpdate))
routerForm.get('/get-list-form-delete', asyncHandler(FormController.getListFormDelete))
routerForm.get('/get-form-pagination', asyncHandler(FormController.getFormPagination))
routerForm.get('/get-form-base-on-date', asyncHandler(FormController.getFormBaseOnDate))

routerForm.get('/get-all-form-state', asyncHandler(FormController.getAllFormState))

routerForm.post('/create-form', asyncHandler(FormController.createForm))
routerForm.delete('/delete-form-id', asyncHandler(FormController.deleteFormId))
routerForm.delete('/delete-form-forever', asyncHandler(FormController.deleteFormForever))

routerForm.post('/change-form-mode', asyncHandler(FormController.changeModeForm))
routerForm.post('/change-mode-display', asyncHandler(FormController.changeModeDisplay))

routerForm.post('/delete-cover', asyncHandler(FormController.deleteCover))
routerForm.post('/upload-avatar', upload.single('file'), asyncHandler(FormController.uploadAvatar))
routerForm.post('/add-avatar', upload.single('file'), asyncHandler(FormController.addAvatar))
routerForm.post('/add-background', upload.single('file'), asyncHandler(FormController.addBackground))
routerForm.post('/upload-cover', upload.single('file'), asyncHandler(FormController.uploadCover))
routerForm.post('/delete-avatar', asyncHandler(FormController.deleteAvatar))

routerForm.post('/update-form', asyncHandler(FormController.updateForm))
routerForm.post('/update-form-title-mode-image', asyncHandler(FormController.setModeImageForm))
routerForm.post('/update-title-input', asyncHandler(FormController.updateTitleInput))

routerForm.post('/add-input', asyncHandler(FormController.addInput))
routerForm.post('/add-input-to-title', asyncHandler(FormController.addInputAndSetTitle))
routerForm.post('/add-input-to-enter', asyncHandler(FormController.addInputToEnter))
routerForm.post('/add-sub-title-item', asyncHandler(FormController.addSubTitleItem))
routerForm.delete('/delete-sub-title-item', asyncHandler(FormController.deleteSubTitleItem))
routerForm.post('/update-sub-title-description', asyncHandler(FormController.updateSubTitleDescription))

routerForm.post('/update-sub-title-text', asyncHandler(FormController.updateTitleSubText))
routerForm.post('/upload-sub-title-image', upload.single('file'), asyncHandler(FormController.uploadTitleImage))
routerForm.post('/set-title-form', asyncHandler(FormController.setTitleForm))

routerForm.post('/update-input-item', asyncHandler(FormController.updateInputItem))
routerForm.post('/delete-input-item', asyncHandler(FormController.deleteInputItem))
routerForm.post('/update-input-item-setting', asyncHandler(FormController.updateSettingInput))
routerForm.post('/change-input-type', asyncHandler(FormController.changeInputType))
routerForm.post('/add-option-value', asyncHandler(FormController.addOption))
routerForm.post('/update-position-option', asyncHandler(FormController.updatePositionOption))
routerForm.delete('/delete-option-id', asyncHandler(FormController.deleteOptionId))

export default routerForm
