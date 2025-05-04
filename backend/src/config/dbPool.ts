import oracledb from "oracledb";
import { dbConfig } from "./dbConfig";

// Define and create the  connection pool
export const pool: Promise<oracledb.Pool> = oracledb.createPool({
  user: dbConfig.user,
  password: dbConfig.password,
  connectString: dbConfig.connectString,
  poolMin: dbConfig.poolMin,
  poolMax: dbConfig.poolMax,
  poolIncrement: dbConfig.poolIncrement,
});
