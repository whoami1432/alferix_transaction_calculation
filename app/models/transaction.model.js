const mongoose = require('mongoose');

const transactionModel = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true
		},
		amount: {
			type: Number,
			required: true
		},
		category: {
			type: String,
			required: true
		},
		description: {
			type: String,
			required: true
		}
	},
	{
		versionKey: false // This will remove the __v field from the schema
	}
);

module.exports = mongoose.model('Transactions', transactionModel);
