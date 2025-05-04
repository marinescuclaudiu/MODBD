import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    console.log('ProductController - Fetching products');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `SELECT * FROM produs`;
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0) {
            const products = result.rows.map((row: any) => ({
               id_produs: row.ID_PRODUS,
               denumire: row.DENUMIRE,
               dimensiune: row.DIMENSIUNE,
               unitate_masura: row.UNITATE_MASURA,
               pret: row.PRET,
               activ: row.ACTIV,
            }));

            return res.status(200).json(products);
        } else {
            return res.status(404).json({ message: 'No products found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching products:', err);
        return res.status(500).json({ error: 'Failed to fetch products' });
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

export const addProduct = async (req: Request, res: Response): Promise<any> => {
    const { denumire, dimensiune, unitate_masura, pret } = req.body;

    console.log('ProductController - Adding producut with name', denumire, 'and size', dimensiune);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sqlFindId = `SELECT MAX(ID_PRODUS) AS MAX_ID FROM PRODUS`;

        // Execute the query
        const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
     
        if (resultFindId.rows && resultFindId.rows.length > 0) {
            const nextId = (resultFindId.rows[0] as any).MAX_ID + 1;

            // Prepare the SQL statement
            const sql = `INSERT INTO PRODUS (ID_PRODUS, DENUMIRE, DIMENSIUNE, UNITATE_MASURA, PRET, ACTIV) VALUES (:nextId, :denumire, :dimensiune, :unitate_masura, :pret, 1)`;
            
            // Execute the query
            const result = await connection.execute(sql, [nextId, denumire, dimensiune, unitate_masura, pret], { autoCommit: true });

            if (result.rowsAffected === 0) {
                return res.status(404).json({ message: 'Something went wrong' });
            }

            return res.status(200).json({ message: 'Product added successfully' });
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

export const updateProduct = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { denumire, dimensiune, unitate_masura, pret } = req.body;

    console.log('ProductController - Updating product with ID:', id);

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `UPDATE PRODUS SET DENUMIRE = :denumire, DIMENSIUNE = :dimensiune, UNITATE_MASURA = :unitate_masura, PRET = :pret WHERE ID_PRODUS = :id`;
    
        // Execute the query    
        const result = await connection.execute(sql, [denumire, dimensiune, unitate_masura, pret, id], { autoCommit: true });

        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product updated successfully' });
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'Failed to update product' });
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
