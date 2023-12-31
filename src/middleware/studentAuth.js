import StudentService from '#~/api/v1/student/services/index.js'
import jwt from 'jsonwebtoken'
import {} from 'dotenv/config'
const access_token_key = process.env.ACCESS_TOKEN_KEY

const studentAuth = async (req, res, next) => {
	try {
		const accessToken = req.headers.authorization.split(' ')[1]
		var {user_id, session_id} = jwt.verify(accessToken, access_token_key)
		const studentService = new StudentService()
		const userInfo = await studentService.getUserInfo(accessToken)
		if (userInfo.role != 'student') {
			next({status: 401, message: 'Unauthorized'})
		} else {
			req.studentService = studentService
			next()
		}
	} catch (err) {
		next({status: 401, message: 'Unauthorized'})
	}
}

export default studentAuth
