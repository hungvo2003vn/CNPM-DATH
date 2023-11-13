import mongoose from 'mongoose'
const Schema = mongoose.Schema
const printer = new Schema(
	{
		printerId: {type: String, default: 'default', maxLength: 50},
		status: {type: Number, default: 0},
		description: {type: String, default: 'this is a printer', maxLength: 100},
		activatedTime: {type: Date, default: Date.now},
		brand: {type: String, default: 'default', maxLength: 50},
		model: {type: String, default: 'default', maxLength: 50},
		location: {
			facility: {type: String, default: 'CS2', maxLength: 20},
			department: {type: String, default: 'H1', maxLength: 20},
			room: {type: String, default: '202', maxLength: 20},
		},
	},
	{
		timestamps: true,
	}
)
export default mongoose.model('printers', printer)
