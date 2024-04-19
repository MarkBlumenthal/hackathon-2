const { Pool } = require('pg');

const pool = new Pool({
    host: 'ep-twilight-queen-a24z353q.eu-central-1.aws.neon.tech',
    database: 'letsgetfat',
    user: 'tasks_owner',
    password: 'krnmxyAqa5e1',
    port: 5432, // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false // Necessary if your PG server uses SSL
    }
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
