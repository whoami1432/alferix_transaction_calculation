const { logger } = require('../config/logger');

const everyReqDetails = (req, res, next) => {
	try {
		const bodyDetails = {
			body: req.body,
			params: req.params,
			query: req.query,
			headers: req.headers
		};
		logger.info({
			requestId: req.id,
			message: `ip: ${req.ip}  ${req.method}/  ${req.headers?.host + req.originalUrl} - ${JSON.stringify(bodyDetails)}`
		});
		next();
	} catch (err) {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} Error - ${err.message},  Error stack - ${err?.stack}` });
		next();
	}
};

module.exports = everyReqDetails;
