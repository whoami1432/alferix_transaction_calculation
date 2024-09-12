'use strict';
const rateLimit = require('express-rate-limit');

const minitues = 2;
const limiter = rateLimit({
	windowMs: minitues * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: `Too many requests, please try again later after ${minitues} minitues.` // Sent message to client too many requests are hitting
});

module.exports = { limiter };
