const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/HP/Desktop/PlotNest website/backend/.env' });

async function init() {
    console.log('Connecting to DB with:', {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        console.log('Creating users table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                email VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created.');

        // Seed a default user if none exists
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', ['Priya']);
        if (rows.length === 0) {
            console.log('Seeding default user...');
            await connection.execute('INSERT INTO users (username, email) VALUES (?, ?)', ['Priya', 'hariasvi21@gmail.com']);
            console.log('Default user seeded.');
        }

        console.log('Creating stories table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS stories (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                author_name VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                genre VARCHAR(100),
                tags JSON,
                content LONGTEXT,
                cover_image LONGTEXT,
                word_count INT DEFAULT 0,
                status ENUM('Draft', 'Published') DEFAULT 'Draft',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Stories table created successfully.');
    } catch (err) {
        console.error('Error during init:', err.message);
    } finally {
        await connection.end();
    }
}

init();
