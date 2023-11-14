import SpsoService from '../services/index.js'

const filterListPrinter = async (req, res, next) => {
	try {
		const {status, sortDirection, facility} = req.query
		const {per_page, current_page} = req
		const data = await new SpsoService().filterListPrinter({
			per_page,
			current_page,
			status:parseInt(status),
			sortDirection: parseInt(sortDirection),
			facility,
		})
		res.status(200).json({data})
	} catch (err) {
		next(err)
	}
}

export default filterListPrinter