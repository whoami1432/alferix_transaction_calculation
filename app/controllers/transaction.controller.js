'use strict';

const { logger } = require('../../config/logger');
const transaction = require('../models/transaction.model');

exports.transactionsCreate = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		if (req.body?.transactions?.length > 0) {
			await transaction.insertMany(req.body.transactions);

			return res.status(201).json({
				Message: 'Transaction created successfully'
			});
		} else {
			return res.status(201).json({
				Message: 'No records to insert'
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.getAllTransactions = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		const allTransactions = await transaction.find({});

		return res.status(200).json({
			Message: 'Transaction listed successfully',
			data: allTransactions
		});
	} catch (error) {
		next(error);
	}
};

exports.getTransactionsWithInDateRange = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		const { startDate, endDate } = req.params || {};

		if (isDateValid(startDate) && isDateValid(endDate) && startDate <= endDate) {
			const transactions = await transaction.find({
				date: {
					$gte: new Date(startDate),
					$lte: new Date(endDate)
				}
			});

			return res.status(200).json({
				Message: 'Transaction listed successfully',
				data: transactions
			});
		} else {
			return res.status(400).json({
				Message: 'Invalid date range or Invalid data input'
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.getTransactionsForAMonth = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		const { year, month } = req.params || {};
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 1);

		if (isDateValid(startDate) && isDateValid(endDate) && startDate <= endDate) {
			const transactions = await transaction.aggregate([
				{
					$match: {
						date: {
							$gte: startDate,
							$lt: endDate
						}
					}
				},
				{
					$group: {
						_id: '$category',
						totalAmount: { $sum: '$amount' }
					}
				},
				{
					$project: {
						_id: 0,
						category: '$_id',
						totalAmount: 1
					}
				}
			]);

			return res.status(200).json({
				Message: 'Transaction listed successfully',
				data: transactions
			});
		} else {
			return res.status(400).json({
				Message: 'Invalid date range or Invalid data input'
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.getTransactionsForLast3Month = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		const now = new Date();
		const threeMonthsAgo = new Date();
		threeMonthsAgo.setMonth(now.getMonth() - 3);

		const result = await transaction.aggregate([
			{
				$match: {
					date: { $gte: threeMonthsAgo, $lte: now }
				}
			},
			{
				$group: {
					_id: '$category',
					totalExpense: { $sum: '$amount' }
				}
			},
			{
				$sort: { totalExpense: -1 }
			},
			{
				$limit: 1
			}
		]);

		if (result.length > 0) {
			return res.status(201).json({
				Message: 'Transaction listed successfully',
				data: result[0]
			});
		} else {
			return res.status(200).json({
				Message: 'No  transactions found for last 3 months',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.getTransactionsAvgForLast6Month = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		const now = new Date();
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(now.getMonth() - 6);

		const result = await transaction.aggregate([
			{
				$match: {
					date: { $gte: sixMonthsAgo, $lte: now }
				}
			},
			{
				$group: {
					_id: {
						year: { $year: '$date' },
						month: { $month: '$date' }
					},
					totalMonthlyExpense: { $sum: '$amount' }
				}
			},
			{
				$group: {
					_id: null,
					averageMonthlyExpense: { $avg: '$totalMonthlyExpense' }
				}
			}
		]);

		if (result.length > 0) {
			return res.status(201).json({
				Message: 'Average monthly expense for the last 6 months',
				data: result[0].averageMonthlyExpense
			});
		} else {
			return res.status(200).json({
				Message: 'No expenses found in the past 6 months',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

exports.anomlytransactionDetails = async (req, res, next) => {
	try {
		logger.info({ requestId: req.id, message: `ip: ${req.ip}  ${req.method}/  ${req.originalUrl} transaction create received` });

		const result = await transaction.aggregate([
			{
				$match: {
					date: {
						$gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
					}
				}
			},
			{
				$group: {
					_id: {
						year: { $year: '$date' },
						month: { $month: '$date' }
					},
					totalExpenses: { $sum: '$amount' }
				}
			},
			{
				$group: {
					_id: null,
					averageMonthlyExpenses: { $avg: '$totalExpenses' },
					monthlyExpenses: { $push: { year: '$_id.year', month: '$_id.month', totalExpenses: '$totalExpenses' } }
				}
			},
			{
				$unwind: '$monthlyExpenses'
			},
			{
				$project: {
					year: '$monthlyExpenses.year',
					month: '$monthlyExpenses.month',
					totalExpenses: '$monthlyExpenses.totalExpenses',
					averageMonthlyExpenses: 1,
					isAnomaly: {
						$gt: ['$monthlyExpenses.totalExpenses', { $multiply: ['$averageMonthlyExpenses', 1.5] }]
					}
				}
			},
			{
				$match: { isAnomaly: true }
			},
			{
				$project: {
					_id: 0,
					year: 1,
					month: 1,
					totalExpenses: 1,
					averageMonthlyExpenses: 1
				}
			}
		]);

		if (result.length > 0) {
			return res.status(201).json({
				Message: 'Anomaly expense founded month',
				data: result
			});
		} else {
			return res.status(200).json({
				Message: 'No anomaly expense founded month',
				data: []
			});
		}
	} catch (error) {
		next(error);
	}
};

// ------------------------ helper functions --------------------
function isDateValid(dateString) {
	const date = new Date(dateString);
	return date.toString() !== 'Invalid Date';
}
