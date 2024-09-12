'use strict';

const express = require('express');
const helmet = require('helmet');

/** if we use node.js version > 20 we don't need this dotenv import, Node.JS support built in import .env config */
require('dotenv').config();
const compression = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const expressMongoanitaize = require('express-mongo-sanitize');

const app = express();

const helloWorldRoute = require('./app/routes/helloWorld.route');
const transactionRoute = require('./app/routes/transactions.route');

const { requestId } = require('./service/uuidGenerator');
const { consoleWritter } = require('./service/consoleViewer');
const notFound = require('./middlewares/notFound');
const erorrHandler = require('./middlewares/errorHandler');
const { limiter } = require('./middlewares/rateLimiter');
const everyReqDetails = require('./middlewares/everyReqCatcher');
const { mongoConnect } = require('./database/MongoDB');

const port = process.env.PORT;

process.on('uncaughtException', error => {
	console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', error => {
	console.error('Unhandled rejection:', error);
});

// app.use(limiter);
app.use(expressMongoanitaize());
app.use(hpp());
app.use('*', cors());
app.use(compression({ level: 1 }));
app.use(requestId);
app.use(helmet());
app.use(express.json({ limit: '500mb', extended: true }));
app.use(everyReqDetails);

app.use('/api/', helloWorldRoute);
app.use('/api/v1/transactions/', transactionRoute);

app.get('/', (req, res) => res.status(200).send('Hello World!'));

// error handlers
app.use('*', notFound);
app.use(erorrHandler);

app.listen(port, () => {
	mongoConnect();
	consoleWritter(port);
});
