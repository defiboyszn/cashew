require('dotenv').config({path: "./.env"});

module.exports = {
    client: 'pg', // Replace 'pg' with your database driver if using a different database
    connection: {
        database: process.env.POSTGRES_DATABASE,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        ssl: process.env.POSTGRES_ENABLE_SSL
    },
    migrations: {
        directory: './database/migrations',
    },
};