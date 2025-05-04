import dotenv from "dotenv";

dotenv.config();

// Define the connection pool interface for better type safety
export interface DbConfig {
  user: string;
  password: string;
  connectString: string;
  poolMin: number;
  poolMax: number;
  poolIncrement: number;
}

export const dbConfig: DbConfig = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  connectString: process.env.DB_CONNECT_STRING || "",
  poolMin: 1,
  poolMax: 5, 
  poolIncrement: 1,
};
