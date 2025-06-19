import pg from 'pg';

import logger from '../middlewares/logger.middlewares.js';

import { config } from '../config/joyas.config.js';

const { db_host, db_port, db_user, db_password, db_database } = config.db;

const pool = new pg.Pool({
  host: db_host,
  port: db_port,
  user: db_user,
  password: db_password,
  database: db_database,
  allowExitOnIdle: true,
});

pool.query('SELECT current_database(), NOW()', (err, res) => {
  if (err) {
    logger.error('Database connection error:', err);
  } else {
    const { current_database, now } = res.rows[0];
    logger.info(
      `Database connected successfully: ${current_database} at ${now}`
    );
  }
});

export default pool;
