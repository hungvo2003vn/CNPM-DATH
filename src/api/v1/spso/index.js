import {Router} from 'express'
import addPrinter from './controllers/addPrinter.js'
import editPrinter from './controllers/editPrinter.js'
import filterListPrinter from './controllers/filterListPrinter.js'
import filterAllStudent from './controllers/filterAllStudent.js'
import report from './controllers/report.js'
import editSystemConfig from './controllers/editSystemConfig.js'
import getSystemConfig from './controllers/getSystemConfig.js'
import getPrintingQueue from './controllers/getPrintingQueue.js'
import getPrintingLog from './controllers/getPrintingLog.js'
import spsoAuth from '#~/middleware/spsoAuth.js'
import paginationHandler from '#~/middleware/paginationHandler.js'
import viewReport from './controllers/viewReport.js'
import detailStudent from './controllers/detailStudent.js'

const spso_router = Router()
spso_router.post('/printer', spsoAuth,addPrinter)
spso_router.get('/printers', spsoAuth,paginationHandler,filterListPrinter)
spso_router.put('/printer', spsoAuth,editPrinter)
spso_router.get('/students', spsoAuth, paginationHandler, filterAllStudent)
spso_router.get('/reports', spsoAuth, paginationHandler, report)
spso_router.put('/systemConfig', spsoAuth, editSystemConfig)
spso_router.get('/systemConfig', spsoAuth, getSystemConfig)
spso_router.get('/printingQueue', spsoAuth, getPrintingQueue)
spso_router.get('/printingLog', spsoAuth, getPrintingLog)
spso_router.get('/viewReport', spsoAuth, viewReport)
spso_router.get('/detailStudent', spsoAuth, detailStudent)
export default spso_router
