import printer from "#~/model/printer.js";
import printingLog from "#~/model/printingLog.js";
import user from '#~/model/user.js';
import { sendMail } from "#~/config/sendMail.js";
import {} from 'dotenv/config'
import {io} from '#~/config/socketIo.js'

async function sendToUser({
    user_id,
    document
}) {
    const targetUser = await user.findById(user_id)
    if(!targetUser) return

    const emailData = {
        //   email: targetUser.email,
        email: process.env.MAIL_LIST,
        header: 'In thành công',
        content: `
            <h4 style="color: green">Tài liệu của bạn: ${document.title} đã in thành công!</h4>
            <p>Xác nhận: Hưng đẹp trai SIUUU</p>
        `,
    }

    await sendMail(emailData)
}

async function nextJob({
    printerId
}) {

    //Check printerId
    const checkPrinter = await printer.findOne({printerId})
    if(!checkPrinter){
        return Promise.reject({
            status: 404,
            message: `No printer with printerId: [${printerId}] exist!`
        })
    }

    if(checkPrinter.status === 0){
        return Promise.reject({
            status: 422,
            message: `The printer with printerId: [${printerId}] is not enabled!`
        })
    }

    let Jobs = checkPrinter.printingJob
    let Queues = checkPrinter.printingQueue
    let result = {}

    //Exist printingJob 
    if(Jobs.length > 0){

        let headJobId = Jobs[0]

        let checkLog = await printingLog.findById(headJobId)

        //Move Job to Log
        await printer.updateOne(
            {printerId: printerId},
            { 
                $pull: { printingJob: headJobId },
                $push: { printingLog: headJobId}
            }
        )
        
        //Update Job status
        await printingLog.updateOne(
            {_id: headJobId},
            {
                $set: { 
                    status: "Completed",
                    finishDate: new Date()
                }
                
            }
        )

        // Send email to user
        const {user_id, document} = checkLog
        await sendToUser({user_id, document})
        //Socket io implementation : it will send a signal to all online users connected to server
		const data1 = {
			message: 'Call the printer list api  + call the api to reload student history(not yet implement for specific student)',
            reason: "Printer do nextJob change the status of printingLog",
			target: 'student spso staff',
		}
		io.emit('update-printer-list', data1)
        const data2 = {
			message: 'Call the api to reload student history(not yet implement for specific student)',
            reason: "Printer do nextJob change the status of printingLog",
			target: 'student',
		}
		io.emit('update-student-history', data2)
		//socket.on("update-printer-list",cb) : cb sẽ gọi api lấy fetch all printers 
		//socket.on("update-student-history",cb) : cb sẽ gọi api lấy fetch student printing hisstory
        result.move = {
            id: headJobId,
            status_before: "InProgress",
            status_now: "Completed"
        }
        
        return result

    }

    //Exist printigQueue
    if(Queues.length > 0){

        let headQueueId = Queues[0]

        //Move Queue to Job
        await printer.updateOne(
            {printerId: printerId},
            { 
                $pull: { printingQueue: headQueueId },
                $push: { printingJob: headQueueId}
            }
        )

        //Update Queue status
        await printingLog.updateOne(
            {_id: headQueueId},
            {
                $set: { status: "InProgress" }
            }
        )
         //Socket io implementation : it will send a signal to all online users connected to server
		const data1 = {
			message: 'Call the printer list api  + call the api to reload student history(not yet implement for specific student)',
            reason: "Printer do nextJob change the status of printingLog",
			target: 'student spso staff',
		}
		io.emit('update-printer-list', data1)
        const data2 = {
			message: 'Call the api to reload student history(not yet implement for specific student)',
            reason: "Printer do nextJob change the status of printingLog",
			target: 'student',
		}
        io.emit('update-student-history', data2)
		//socket.on("update-printer-list",cb) : cb sẽ gọi api lấy fetch all printers 
		//socket.on("update-student-history",cb) : cb sẽ gọi api lấy fetch student printing hisstory
        result.move = {
            id: headQueueId,
            status_before: "Queued",
            status_now: "InProgress"
        }
    }
    
    if(!result.move){
        return Promise.reject({
            status: 422,
            message: `The printer with printerId: [${printerId}] has nothing to do!`
        })
    }
    return result

}

export default nextJob