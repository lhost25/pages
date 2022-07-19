// const Manager = require('../model/Manager');

module.exports = (req, res, next) => {

	const finishError = (msg, codeNum= 700) => {
		const messageObj = {
			status: "Error",
			code: codeNum,
			message: msg
		}
		res.status(401).json(messageObj)
	}
	
}
