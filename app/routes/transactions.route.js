'use strict';
const express = require('express');

const router = express.Router();

const transaction = require('../controllers/transaction.controller');

router.post('/create', transaction.transactionsCreate);
router.get('/all', transaction.getAllTransactions);
router.get('/:startDate/:endDate', transaction.getTransactionsWithInDateRange);
router.get('/monthexpences/:year/:month', transaction.getTransactionsForAMonth);
router.get('/advanced/lastthreemonth/highestcategory', transaction.getTransactionsForLast3Month);
router.get('/advanced/lastsixmonth/avgsalary', transaction.getTransactionsAvgForLast6Month);
router.get('/advanced/lastyear/anomalymonth', transaction.anomlytransactionDetails);

module.exports = router;
