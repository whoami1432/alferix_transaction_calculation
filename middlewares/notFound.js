'use strict';
const notFound = (req, res) => {
	res.status(404).send({
		success: 'false',
		message: 'Page not found',
		error: {
			statusCode: 404,
			message: 'Could not find this route'
		}
	});
};

module.exports = notFound;
