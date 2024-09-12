'use strict';
const uuid = require('uuid');

/**
 * uuid add in request ( find the sequence of logger and multipurpose )
 * ex: req.id = uuid ( uuid add in request )
 * @param {*} req //it will come from client
 * @param {*} res //it will return response
 * @param {*} next //once completed next process will begin
 */
function requestId(req, res, next) {
	req.id = uuid.v4();
	next();
}

module.exports = { requestId };
