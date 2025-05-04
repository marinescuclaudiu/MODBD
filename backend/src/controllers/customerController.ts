import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';

export const addCustomer = async (req: Request, res: Response): Promise<any> => {
    const { nume, prenume, email, parola } = req.body;

    console.log('CustomerController - Adding customer with name', nume, 'and surname', prenume);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sqlFindId = `SELECT MAX(ID_CLIENT) AS MAX_ID FROM CLIENTI_GLOBAL`;

        // Execute the query
        const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
     
        if (resultFindId.rows && resultFindId.rows.length > 0) {
            const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

            // Prepare the SQL statement
            const sql = `INSERT INTO CLIENTI_GLOBAL (ID_CLIENT, NUME, PRENUME, EMAIL, PAROLA) VALUES (:nextId, :nume, :prenume, :email, :parola)`;
            
            // Execute the query
            const result = await connection.execute(sql, [nextId, nume, prenume, email, parola], { autoCommit: true });

            if (result.rowsAffected === 0) {
                return res.status(404).json({ message: 'Something went wrong' });
            }

            return res.status(200).json({ message: 'Customer added successfully' });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    } finally {
        if (connection) {
            try {
            await connection.close();
            } catch (err) {
            console.error('Error closing connection:', err);
            }
        }
    }
}