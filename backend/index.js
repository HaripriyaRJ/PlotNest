const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('Attempting to connect to MySQL at:', process.env.DB_HOST);
db.getConnection((err, connection) => {
    if (err) {
        console.error('CRITICAL: Error connecting to MySQL:', err.message);
        console.error('Check if database container "db" is running and reachable.');
        // Don't exit, let the server start so we can see it's alive, but most routes will fail.
        return;
    }
    console.log('SUCCESS: Connected to MySQL database via pool');
    
    // Create tables if not exists
    const queries = [
        `CREATE TABLE IF NOT EXISTS story_reads (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            story_id INT NOT NULL,
            username VARCHAR(255),
            read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
        )`,
        `CREATE TABLE IF NOT EXISTS user_library (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            story_id INT NOT NULL,
            status ENUM('Reading', 'Completed', 'Dropped') DEFAULT 'Reading',
            last_read TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY (username, story_id)
        )`,
        `CREATE TABLE IF NOT EXISTS user_bookmarks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            story_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS reading_activity (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            activity_date DATE NOT NULL,
            UNIQUE KEY (username, activity_date)
        )`
    ];

    queries.forEach(q => {
        db.query(q, (err) => {
            if (err) console.error('Error creating table:', err);
        });
    });

    // Seed "Priya" data for demo
    const seedQueries = [
        `INSERT IGNORE INTO user_library (username, story_id, status) VALUES ('Priya', 1, 'Reading'), ('Priya', 2, 'Reading'), ('Priya', 3, 'Completed')`,
        `INSERT IGNORE INTO user_bookmarks (username, story_id) VALUES ('Priya', 1), ('Priya', 4), ('Priya', 5)`,
        `INSERT IGNORE INTO reading_activity (username, activity_date) VALUES ('Priya', CURDATE()), ('Priya', DATE_SUB(CURDATE(), INTERVAL 1 DAY)), ('Priya', DATE_SUB(CURDATE(), INTERVAL 2 DAY))`
    ];
    seedQueries.forEach(q => db.query(q));

    connection.release();
});

app.get('/', (req, res) => {
    res.send('PlotNest Backend is running');
});

// User profile endpoints
app.get('/api/user/:username', (req, res) => {
    const username = req.params.username;
    console.log(`Fetching profile for user: ${username}`);
    const query = 'SELECT username, email FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
});

app.post('/api/user/update', (req, res) => {
    const { oldUsername, newUsername, email } = req.body;
    console.log(`Updating user ${oldUsername} to ${newUsername} / ${email}`);

    const query = 'UPDATE users SET username = ?, email = ? WHERE username = ?';
    db.query(query, [newUsername, email, oldUsername], (err, result) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User settings updated successfully' });
    });
});

// Get all published stories for client dashboard
app.get('/api/stories/published', (req, res) => {
    const query = 'SELECT * FROM stories WHERE status = ? ORDER BY created_at DESC';
    db.query(query, ['Published'], (err, results) => {
        if (err) {
            console.error('Error fetching published stories:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all stories for a specific author (including drafts)
app.get('/api/stories/author/:authorName', (req, res) => {
    const authorName = req.params.authorName;
    const query = 'SELECT * FROM stories WHERE author_name = ? ORDER BY created_at DESC';
    db.query(query, [authorName], (err, results) => {
        if (err) {
            console.error('Error fetching author stories:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Create or update a story
app.post('/api/stories', (req, res) => {
    console.log(`Received ${req.method} request to /api/stories`);
    const { id, author_name, title, description, genre, tags, content, cover_image, word_count, status } = req.body;

    const isServerId = id && !isNaN(id) && parseInt(id) < 1000000000;

    if (isServerId) {
        const query = `
            UPDATE stories 
            SET title = ?, description = ?, genre = ?, tags = ?, content = ?, cover_image = ?, word_count = ?, status = ?
            WHERE id = ? AND author_name = ?
        `;
        const values = [title, description, genre, JSON.stringify(tags), content, cover_image, word_count, status, id, author_name];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error updating story:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Story updated successfully', id });
        });
    } else {
        const query = `
            INSERT INTO stories (author_name, title, description, genre, tags, content, cover_image, word_count, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [author_name, title, description, genre, JSON.stringify(tags), content, cover_image, word_count, status];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting story:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Story created successfully', id: result.insertId });
        });
    }
});

// Increment read count for a story
app.post('/api/stories/:id/read', (req, res) => {
    const id = req.params.id;
    const { username } = req.body;
    const updateQuery = 'UPDATE stories SET reads_count = reads_count + 1 WHERE id = ?';
    const insertQuery = 'INSERT INTO story_reads (story_id, username) VALUES (?, ?)';
    const activityQuery = 'INSERT IGNORE INTO reading_activity (username, activity_date) VALUES (?, CURDATE())';

    db.query(updateQuery, [id], (err, result) => {
        if (err) {
            console.error('Error incrementing read count:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Also record individual read with timestamp
        db.query(insertQuery, [id, username], (err2) => {
            if (err2) console.error('Error recording read timestamp:', err2);
            
            // Record activity for streak
            if (username) {
                db.query(activityQuery, [username]);
                // Ensure story is in library
                db.query('INSERT IGNORE INTO user_library (username, story_id, status) VALUES (?, ?, "Reading")', [username, id]);
            }
            
            res.json({ message: 'Read count incremented and recorded successfully' });
        });
    });
});

// Get analytics: reads per day for the last 30 days
app.get('/api/analytics/reads-over-time', (req, res) => {
    const { author_name } = req.query;
    if (!author_name) return res.status(400).json({ error: 'Missing author_name' });

    const query = `
        SELECT DATE(read_at) as date, COUNT(*) as count, 
               SUM(CASE WHEN HOUR(read_at) BETWEEN 6 AND 11 THEN 1 ELSE 0 END) as morning,
               SUM(CASE WHEN HOUR(read_at) BETWEEN 17 AND 20 THEN 1 ELSE 0 END) as evening,
               SUM(CASE WHEN HOUR(read_at) >= 21 OR HOUR(read_at) < 6 THEN 1 ELSE 0 END) as night
        FROM story_reads 
        WHERE story_id IN (SELECT id FROM stories WHERE author_name = ?) 
        AND read_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        GROUP BY DATE(read_at)
        ORDER BY date ASC
    `;

    db.query(query, [author_name], (err, rows) => {
        if (err) {
            console.error('Analytics Error:', err);
            return res.status(500).json({ error: 'Failed to fetch analytics' });
        }

        const distribution = {
            morning: rows.reduce((acc, r) => acc + parseInt(r.morning || 0), 0),
            evening: rows.reduce((acc, r) => acc + parseInt(r.evening || 0), 0),
            night: rows.reduce((acc, r) => acc + parseInt(r.night || 0), 0)
        };

        res.json({ data: rows, distribution });
    });
});

// Get consolidated dashboard stats for a user
app.get('/api/user/:username/stats', (req, res) => {
    const username = req.params.username;
    
    const queries = {
        libraryCount: 'SELECT COUNT(*) as count FROM user_library WHERE username = ?',
        readingCount: 'SELECT COUNT(*) as count FROM user_library WHERE username = ? AND status = "Reading"',
        bookmarkCount: 'SELECT COUNT(*) as count FROM user_bookmarks WHERE username = ?',
        streakDates: 'SELECT activity_date FROM reading_activity WHERE username = ? ORDER BY activity_date DESC'
    };

    const stats = {
        booksInLibrary: 0,
        currentlyReading: 0,
        bookmarks: 0,
        streak: 0
    };

    db.query(queries.libraryCount, [username], (err, res1) => {
        if (!err && res1[0]) stats.booksInLibrary = res1[0].count;
        
        db.query(queries.readingCount, [username], (err, res2) => {
            if (!err && res2[0]) stats.currentlyReading = res2[0].count;
            
            db.query(queries.bookmarkCount, [username], (err, res3) => {
                if (!err && res3[0]) stats.bookmarks = res3[0].count;
                
                db.query(queries.streakDates, [username], (err, res4) => {
                    if (!err && res4.length > 0) {
                        let streak = 0;
                        let today = new Date();
                        today.setHours(0,0,0,0);
                        
                        let current = today;
                        for (let i = 0; i < res4.length; i++) {
                            let activityDate = new Date(res4[i].activity_date);
                            activityDate.setHours(0,0,0,0);
                            
                            // Check if activity is today or yesterday from 'current'
                            const diff = (current - activityDate) / (1000 * 60 * 60 * 24);
                            if (diff === 0) {
                                streak++;
                            } else if (diff === 1) {
                                streak++;
                                current = activityDate;
                            } else if (diff > 1 && i === 0) {
                                // If first activity is not today or yesterday, streak is 0
                                streak = 0;
                                break;
                            } else {
                                break;
                            }
                        }
                        stats.streak = streak;
                    }
                    res.json(stats);
                });
            });
        });
    });
});

// Delete a story
app.delete('/api/stories/:id', (req, res) => {
    const query = 'DELETE FROM stories WHERE id = ?';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error('Error deleting story:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Story deleted successfully' });
    });
});

// Update author name across all stories
app.post('/api/author/update-name', (req, res) => {
    const { old_name, new_name } = req.body;
    if (!old_name || !new_name) return res.status(400).json({ error: 'Missing names' });

    const query = 'UPDATE stories SET author_name = ? WHERE author_name = ?';
    db.query(query, [new_name, old_name], (err, result) => {
        if (err) {
            console.error('Error updating author name in stories:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Author name updated in stories', affectedRows: result.affectedRows });
    });
});

app.post("/api/generate-story", async (req, res) => {
    try {

        const { prompt, apiKey } = req.body;
        console.log('AI Story Generation started for prompt:', prompt.substring(0, 50) + '...');

        // Keys to try in order of preference
        const keysToTry = [];
        if (apiKey && apiKey.trim()) keysToTry.push({ key: apiKey.trim(), source: 'Frontend' });
        if (process.env.GEMINI_API_KEY) keysToTry.push({ key: process.env.GEMINI_API_KEY.trim(), source: 'Environment' });

        if (keysToTry.length === 0) {
            console.error('ERROR: No API Key provided anywhere.');
            return res.status(500).json({ error: "AI configuration missing (API Key)" });
        }

        // Models to try in order of preference (including verified identifiers)
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-pro-latest",
            "gemini-1.5-flash",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        let result;
        let lastError;

        for (const keyData of keysToTry) {
            console.log(`Trying API Key from ${keyData.source} (Length: ${keyData.key.length})...`);
            const client = new GoogleGenerativeAI(keyData.key);

            for (const modelName of modelsToTry) {
                try {
                    console.log(`Attempting with model: ${modelName} using ${keyData.source} key...`);
                    const model = client.getGenerativeModel({ model: modelName });
                    result = await model.generateContent(
                        `Write a complete, creative, and engaging story based on this idea: "${prompt}".
                        
                        The story must be comprehensive (at least 500-800 words) and follow a traditional narrative structure:
                        1. An intriguing introduction with character and setting establishment.
                        2. A rising action with conflict and development.
                        3. A clear climax.
                        4. A satisfying resolution.
                        
                        Format the story with clear paragraphs. Use HTML <p> tags for paragraphs and <h3> for chapter or section titles if necessary, as this will be inserted into a rich text editor.`
                    );

                    console.log(`AI Generation SUCCESS with model ${modelName} using ${keyData.source} key.`);
                    break; // Inner loop success
                } catch (err) {
                    console.warn(`Model ${modelName} FAILED with ${keyData.source} key:`, err.message || err);
                    lastError = err;

                    // If the Error is specifically "API key not valid", we should stop trying models with THIS key
                    if (err.message && (err.message.includes("API key not valid") || err.message.includes("API_KEY_INVALID"))) {
                        console.log(`Current key (${keyData.source}) is invalid. Skipping remaining models for this key.`);
                        break;
                    }
                }
            }
            if (result) break; // Outer loop success
        }

        if (!result) {
            throw lastError || new Error("All AI keys and models failed to generate content.");
        }

        const story = result.response.text();
        res.json({ story });

    } catch (error) {
        console.error("Gemini full error:", error);
        res.status(500).json({
            error: "AI story generation failed",
            details: error.message || "Unknown error"
        });
    }
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Essential for Docker accessibility

app.listen(PORT, HOST, () => {
    console.log(`Server running and listening on http://${HOST}:${PORT}`);
    console.log(`Backend is ready to receive requests.`);
});
