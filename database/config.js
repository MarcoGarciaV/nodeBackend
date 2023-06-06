const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB online')
    } catch (error) {
        console.log(error);
        throw new Error('Error when app was initializing.');
    }
}

module.exports = {
    dbConnection
}