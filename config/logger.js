'use strict';
const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new winston.transports.DailyRotateFile({
	filename: `Logger_%DATE%.log`,
	dirname: `./logs/`,
	datePattern: 'MM-DD-YYYY',
	zippedArchive: true,
	maxSize: '500m',
	maxFiles: '90d',
	colorize: true,
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'MMM-DD-YYYY HH:mm:ss.SSS'
		}),
		winston.format.printf(info => {
			if (info.username === undefined) {
				info.username = 'NA';
			}
			return `{"DateTime":"${info.timestamp}","Level":"${info.level}","RequestId":"${info.requestId}","Username":"${info.username}","Module":"${info.reqdetails}","Message": "${info.message}"}`;
		})
	)
});

const logger = new winston.createLogger({
	transports: [transport],
	exitOnError: false // do not exit on handled exceptions
});

module.exports = { logger };
