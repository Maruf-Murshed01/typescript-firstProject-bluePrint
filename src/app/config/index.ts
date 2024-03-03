import dotenv from 'dotenv';
import path from 'path';

//main file er sathe dotenv file er connection
dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};
