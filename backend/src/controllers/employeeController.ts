import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';

export const addEmployee = async (req: Request, res: Response): Promise<any> => {
    const {  nume, prenume, salariu, id_cafenea } = req.body;

    console.log('EmployeeController - Adding employee with name', nume, 'and surname', prenume);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sqlFindId = `SELECT MAX(ID_ANGAJAT) AS MAX_ID FROM ANGAJATI_GLOBAL`;

        // Execute the query
        const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
     
        if (resultFindId.rows && resultFindId.rows.length > 0) {
            const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

            // Prepare the SQL statement
            const sql = `INSERT INTO ANGAJATI_GLOBAL (ID_ANGAJAT, NUME, PRENUME, SALARIU, ID_CAFENEA, DATA_ANGAJARII) VALUES (:nextId, :nume, :prenume, :salariu, :id_cafenea, SYSDATE)`;
            
            // Execute the query
            const result = await connection.execute(sql, [nextId, nume, prenume, salariu, id_cafenea], { autoCommit: true });

            if (result.rowsAffected === 0) {
                return res.status(404).json({ message: 'Something went wrong' });
            }

            return res.status(200).json({ message: 'Employee added successfully' });
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

export const getEmployees = async (req: Request, res: Response): Promise<any> => {
    console.log('EmployeeController - Fetching employees');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `
        SELECT a.*, c.nume_cafenea, r.nume AS regiune FROM ANGAJATI_GLOBAL a
        JOIN cafenele_global c on a.id_cafenea = c.id_cafenea
        JOIN locatii_global l on c.id_locatie = l.id_locatie
        JOIN orase_global o on l.id_oras = o.id_oras
        JOIN judete_global j on o.id_judet = j.id_judet
        JOIN regiuni_global r on r.id_regiune = j.id_regiune
        `;
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0) {
            const employees = result.rows.map((row: any) => ({
                id_angajat: row.ID_ANGAJAT,
                nume: row.NUME,
                prenume: row.PRENUME,
                data_angajarii: row.DATA_ANGAJARII,
                salariu: row.SALARIU,
                id_cafenea: row.ID_CAFENEA,
                nume_cafenea: row.NUME_CAFENEA,
                regiune: row.REGIUNE
            }));

            return res.status(200).json(employees);
        } else {
            return res.status(404).json({ message: 'No employees found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching employees:', err);
        return res.status(500).json({ error: 'Failed to fetch employees' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            try {
            await connection.close();
            } catch (closeError) {
            console.error('Error closing connection:', closeError);
            }
        }
    }
}