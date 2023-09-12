import express from 'express'
import cors from 'cors'
import router from '../routers/index.js'
import configSwagger from './swagger.js'
import {} from "dotenv/config";

const port = process.env.PORT || 8080

const configExpressApp = async (app) => {
	app.set('port', port)
	app.use(cors())
	app.use(express.urlencoded({extended: false}))
	app.use(express.json())
	app.use(router)
	app.use((error, req, res, next) => {
		console.log(error.message)
		const status = error.status || 500
		const message = error.message
		const data = error.data
		res.status(status).json({message: message, data: data})
	})

	app.get('/', async function (req, res) {
		try {
			res.status(200).json({message: 'OK'})
		} catch (err) {
			res.status(500).json({message: err.message})
		}
	})
	configSwagger(app)
	app.listen(app.get('port'), async () => {
		console.log(`start server at port: ${app.get('port')}`)
	})
	return app
}

export default configExpressApp