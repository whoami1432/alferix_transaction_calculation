const mongoose = require('mongoose');

const mongoConnect = () => {
	try {
		const mongoURI = process.env.MONGODB_CONNECTION_STRING;
		mongoose
			.connect(mongoURI)
			.then(() => console.log('MongoDB connected successfully'))
			.catch(err => console.error('MongoDB connection error:', err));

		const db = mongoose.connection;

		db.on('error', err => {
			console.error('Connection error:', err);
		});

		db.once('open', () => {
			console.log('Connected to MongoDB');
		});
	} catch (error) {
		console.log(error.message);
	}
};

module.exports = { mongoConnect };
