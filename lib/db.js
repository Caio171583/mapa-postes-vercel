import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  idleTimeoutMillis: 10000,       // desconecta se ocioso por 10s
  connectionTimeoutMillis: 5000,  // erro se não conectar em 5s
});

export default pool;
