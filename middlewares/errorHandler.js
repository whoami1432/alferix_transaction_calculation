'use strict';

const { logger } = require('../config/logger');

const errorHandler = (err, req, res, next) => {
	try {
		// Middleware to handle errors
		// Log the error for debugging purposes (you can customize the logging mechanism)
		console.error(err);

		//Log the error in log file for debugging purposes (you can customize the logging mechanism)
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} Error - ${err.message},  Error stack - ${err?.stack}` });

		// Send an appropriate error response to the client
		res.status(err.status || 500).json({
			success: 'false',
			message: 'Internal server error',
			error: {
				statusCode: 500,
				message: err.message,
				stack: err.stack
			}
		});
	} catch (err) {
		next(err);
	}
};

module.exports = errorHandler;
