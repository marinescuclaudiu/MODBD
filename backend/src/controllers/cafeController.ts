import { Request, Response } from "express";
import { pool } from "../config/dbPool";
import oracledb from 'oracledb';

export const getCafes = async (req: Request, res: Response): Promise<any> => {
    console.log('CafeController - Fetching cafes');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `
        SELECT c.id_cafenea, c.nume_cafenea, 
               l.strada, l.numar, 
               o.nume oras,
               j.nume judet,
               r.nume regiune
        FROM cafenele_global c
        JOIN locatii_global l ON c.id_locatie = l.id_locatie
        JOIN orase_global o ON l.id_oras = o.id_oras
        JOIN judete_global j ON o.id_judet = j.id_judet
        JOIN regiuni_global r ON j.id_regiune = r.id_regiune
        `;
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0) {
            const cafes = result.rows.map((row: any) => ({
                id_cafenea: row.ID_CAFENEA,
                nume_cafenea: row.NUME_CAFENEA,
                strada: row.STRADA,
                numar: row.NUMAR,
                oras: row.ORAS,
                judet: row.JUDET,
                regiune: row.REGIUNE
            }));

            return res.status(200).json(cafes);
        } else {
            return res.status(404).json({ message: 'No cafes found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching cafes:', err);
        return res.status(500).json({ error: 'Failed to fetch cafes' });
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

export const getCafeInventories = async (req: Request, res: Response): Promise<any> => {
    console.log('CafeController - Fetching cafe inventories');  

    // Initialize the connection
    let connection: oracledb.Connection | null = null;
    
    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `
        SELECT i.id_cafenea, c.nume_cafenea, i.id_materie, mp.nume_materie, i.cantitate
        FROM INVENTARE_CAFENELE_GLOBAL i
        JOIN cafenele_global c ON i.id_cafenea = c.id_cafenea
        JOIN materie_prima mp ON i.id_materie = mp.id_materie
        `;
    
        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0) {
            const cafeInventories = result.rows.map((row: any) => ({
                id_cafenea: row.ID_CAFENEA,
                nume_cafenea: row.NUME_CAFENEA,
                id_materie: row.ID_MATERIE,
                nume_materie: row.NUME_MATERIE,
                cantitate: row.CANTITATE,
            }));

            return res.status(200).json(cafeInventories);
        } else {
            return res.status(404).json({ message: 'No cafe inventories found' });
        }
    }
    catch (err) {
        // Handle any errors that occur
        console.error('Error fetching cafe inventories:', err);
        return res.status(500).json({ error: 'Failed to fetch cafe inventories' });
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

export const updateCafeInventory = async (req: Request, res: Response): Promise<any> => {
    const { id_cafenea, id_materie, cantitate } = req.body;

    console.log('ProductController - Updating cafe inventory for ID_CAFENEA:', id_cafenea, 'and ID_MATERIE:', id_materie);

    let connection: oracledb.Connection | null = null;

    try {
        const resolvedPool = await pool;
        connection = await resolvedPool.getConnection();

        // First, find the region of the cafe
        const regionQuery = `
            SELECT r.nume AS nume_regiune
            FROM regiuni_global r
            JOIN judete_global j ON r.id_regiune = j.id_regiune
            JOIN orase_global o ON o.id_judet = j.id_judet
            JOIN locatii_global l ON l.id_oras = o.id_oras
            JOIN cafenele_global c ON c.id_locatie = l.id_locatie
            WHERE c.id_cafenea = :id_cafenea
        `;

        const regionResult = await connection.execute<{ NUME_REGIUNE: string }>(regionQuery, [id_cafenea], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        
        if (!regionResult.rows || regionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cafe not found' });
        }
        
        const numeRegiune = regionResult.rows[0].NUME_REGIUNE;
        console.log('Found region:', numeRegiune);


        // Now, decide which table to update
        let updateSql = '';
        if (numeRegiune === 'Bucuresti-Ilfov') {
            updateSql = `
                UPDATE inventar_cafenea_bucuresti@bd_bucuresti
                SET cantitate = :cantitate
                WHERE id_cafenea = :id_cafenea AND id_materie = :id_materie
            `;
        } else {
            updateSql = `
                UPDATE inventar_cafenea_provincie@bd_provincie
                SET cantitate = :cantitate
                WHERE id_cafenea = :id_cafenea AND id_materie = :id_materie
            `;
        }

        const updateResult = await connection.execute(updateSql, {
            cantitate,
            id_cafenea,
            id_materie
        }, { autoCommit: true });

        if (updateResult.rowsAffected === 0) {
            return res.status(404).json({ message: 'Inventory record not found for update' });
        }

        return res.status(200).json({ message: 'Cafe inventory updated successfully' });
    } 
    catch (err) {
        console.error('Error updating cafe inventory:', err);
        return res.status(500).json({ error: 'Failed to update cafe inventory' });
    } 
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error('Error closing connection:', closeError);
            }
        }
    }
}


export const deleteCafeInventory = async (req: Request, res: Response): Promise<any> => {
    const { id_cafenea, id_materie } = req.body;

    console.log('ProductController - Deleting cafe inventory for ID_CAFENEA:', id_cafenea, 'and ID_MATERIE:', id_materie);

    let connection: oracledb.Connection | null = null;

    try {
        const resolvedPool = await pool;
        connection = await resolvedPool.getConnection();

        // Step 1: Find the region
        const regionQuery = `
            SELECT r.nume AS nume_regiune
            FROM regiuni_global r
            JOIN judete_global j ON r.id_regiune = j.id_regiune
            JOIN orase_global o ON o.id_judet = j.id_judet
            JOIN locatii_global l ON l.id_oras = o.id_oras
            JOIN cafenele_global c ON c.id_locatie = l.id_locatie
            WHERE c.id_cafenea = :id_cafenea
        `;

        const regionResult = await connection.execute<{ NUME_REGIUNE: string }>(regionQuery, [id_cafenea], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (!regionResult.rows || regionResult.rows.length === 0) {
            return res.status(404).json({ message: 'Cafe not found' });
        }

        const numeRegiune = regionResult.rows[0].NUME_REGIUNE;
        console.log('Found region:', numeRegiune);

        // Step 2: Choose correct table
        let inventoryTable = '';
        if (numeRegiune === 'Bucuresti-Ilfov') {
            inventoryTable = 'inventar_cafenea_bucuresti@bd_bucuresti';
        } else {
            inventoryTable = 'inventar_cafenea_provincie@bd_provincie';
        }

        // Step 3: Check if cantitate = 0
        const cantitateQuery = `
            SELECT cantitate
            FROM ${inventoryTable}
            WHERE id_cafenea = :id_cafenea AND id_materie = :id_materie
        `;

        const cantitateResult = await connection.execute<{ CANTITATE: number }>(cantitateQuery, 
            { id_cafenea, id_materie }, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        if (!cantitateResult.rows || cantitateResult.rows.length === 0) {
            return res.status(404).json({ message: 'Inventory record not found' });
        }

        const currentCantitate = cantitateResult.rows[0].CANTITATE;
        console.log('Found cantitate:', currentCantitate);

        if (currentCantitate !== 0) {
            return res.status(400).json({ message: 'Cannot delete inventory item because cantitate is not 0' });
        }

        // Step 4: Delete
        const deleteSql = `
            DELETE FROM ${inventoryTable}
            WHERE id_cafenea = :id_cafenea AND id_materie = :id_materie
        `;

        const deleteResult = await connection.execute(deleteSql, 
            { id_cafenea, id_materie }, 
            { autoCommit: true }
        );

        if (deleteResult.rowsAffected === 0) {
            return res.status(404).json({ message: 'Inventory record not found for delete' });
        }

        return res.status(200).json({ message: 'Cafe inventory deleted successfully' });
    } 
    catch (err) {
        console.error('Error deleting cafe inventory:', err);
        return res.status(500).json({ error: 'Failed to delete cafe inventory' });
    } 
    finally {
        if (connection) {
            try {
                await connection.close();
            } catch (closeError) {
                console.error('Error closing connection:', closeError);
            }
        }
    }
}
