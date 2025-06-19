import 'dotenv/config';

export const config = {
  server: {
    env: process.env.NODE_ENV || 'development',
    protocol: process.env.PROTOCOL || 'http',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
  },
  db: {
    db_host: process.env.DB_HOST || 'localhost',
    db_user: process.env.DB_USER || 'postgres',
    db_password: process.env.DB_PASSWORD || '',
    db_port: process.env.DB_PORT || 5432,
    db_database: process.env.DB_DATABASE || 'mydb',
  },
};
