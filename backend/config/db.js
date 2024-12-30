import pkg from 'pg';
const { Client } = pkg
import dotenv from 'dotenv'
dotenv.config()

export const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT || 5432,
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log('PostgreSQL Connected...');
    } catch (err) {
        console.error('Error connecting to PostgreSQL:', err.message);
    }
};

export default connectDB;