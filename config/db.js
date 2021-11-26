const mongoose = require('mongoose');
require('dotenv/config');

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_DB,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            dbName: 'easy-shop' 
        })
        console.log('Database connection is ready...')
    } catch (error) {
        console.log(error);
        process.exit(1); //Detener la app
    }
}

module.exports = conectarDB