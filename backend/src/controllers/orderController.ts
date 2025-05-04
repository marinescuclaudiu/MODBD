import oracledb from 'oracledb';
import { pool } from '../config/dbPool';
import { Request, Response } from 'express';
import { log } from 'console';

interface Product {
    id_produs: number;
    cantitate: number;
}

interface OrderRequestBody {
    id_client: number;
    id_cafenea: number;
    products: Product[];
}


export const getOrders = async (req: Request, res: Response): Promise<any> => {
    console.log('OrderController - Fetching order details');

    let connection: oracledb.Connection | null = null;

    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement
        const sql = `
            SELECT c.id_comanda_client, c.id_produs, c.cantitate, c.pret_final,
                   o.data_plasarii, o.id_client, o.id_cafenea
            FROM comenzi_produse_global c
            JOIN COMENZI_CLIENTI_GLOBAL o 
            ON c.id_comanda_client = o.id_comanda_client
        `;

        // Execute the query
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        // Map the result rows to the desired format
        if (result.rows && result.rows.length > 0) {
            // Creating a map for orders, where each order holds its products
            const ordersMap: any = {};

            result.rows.forEach((row: any) => {
                const orderId = row.ID_COMANDA_CLIENT;

                // Initialize the order if it's not already in the map
                if (!ordersMap[orderId]) {
                    ordersMap[orderId] = {
                        orderId: row.ID_COMANDA_CLIENT,
                        data_plasarii: row.DATA_PLASARII,
                        id_client: row.ID_CLIENT,
                        id_cafenea: row.ID_CAFENEA,
                        products: [],
                    };
                }

                // Push the product details to the order's products array
                ordersMap[orderId].products.push({
                    id_produs: row.ID_PRODUS,
                    cantitate: row.CANTITATE,
                    pret_final: row.PRET_FINAL,
                });
            });

            // Convert orders map into an array of orders
            const orders = Object.values(ordersMap);

            return res.status(200).json(orders);
        } else {
            return res.status(404).json({ message: 'No orders found' });
        }
    } catch (err) {
        // Handle any errors that occur
        console.error('Error fetching order details:', err);
        return res.status(500).json({ error: 'Failed to fetch order details' });
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
};

export const createOrder = async (req: Request, res: Response): Promise<any> => {
    console.log('OrderController - Creating an order');

    const { id_client, id_cafenea, products }: OrderRequestBody = req.body;

    if (!id_client || !id_cafenea || !products || products.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    let connection: oracledb.Connection | null = null;

    try {
        // Wait for the pool to resolve
        const resolvedPool = await pool;

        // Get a connection from the pool
        connection = await resolvedPool.getConnection();

        // Prepare the SQL statement - using NVL to handle NULL case
        const sqlFindId = `SELECT NVL(MAX(ID_COMANDA_CLIENT), 0) AS MAX_ID FROM comenzi_clienti_global`;

        // Execute the query
        const resultFindId = await connection.execute(sqlFindId, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    
        const nextId = (resultFindId.rows?.[0] as any).MAX_ID + 1;

        console.log('Next Order ID:', nextId);
        console.log('Client ID:', id_client);
        console.log('Cafenea ID:', id_cafenea);
        
        // Insert into the comenzi_clienti_global table
        const insertOrderSQL = `
            INSERT INTO comenzi_clienti_global 
            (id_comanda_client, id_client, id_cafenea, data_plasarii)
            VALUES (:nextId, :id_client, :id_cafenea, SYSDATE)
        `;
        
        await connection.execute(insertOrderSQL, {
            nextId: nextId,
            id_client: id_client,
            id_cafenea: id_cafenea
        }, { autoCommit: true });

        console.log('Order inserted into comenzi_clienti_global');

        // Insert into the comenzi_produse_global table for each product
        for (const product of products) {
            const { id_produs, cantitate } = product;

            console.log('Id produs:', id_produs);
            console.log('Cantitate:', cantitate);

            // Fetch the product price (pret_final) from the produs table
            const productPriceSQL = `
                SELECT pret
                FROM produs
                WHERE id_produs = :id_produs
            `;
            
            const productResult = await connection.execute(productPriceSQL, {
                id_produs: id_produs
            });

            
            if (productResult.rows && productResult.rows.length > 0) {
                const pret_final = (productResult.rows as any[][])[0][0]; 

                console.log('pret produs ', pret_final)

                // Insert into comenzi_produse_global
                const insertProductSQL = `
                    INSERT INTO comenzi_produse_global 
                    (id_comanda_client, id_produs, cantitate, pret_final)
                    VALUES (:nextId, :id_produs, :cantitate, :pret_final)
                `;

                await connection.execute(insertProductSQL, {
                    nextId: nextId,
                    id_produs: id_produs,
                    cantitate: cantitate,
                    pret_final: pret_final
                }, { autoCommit: true });
            } else {
                throw new Error(`Product with id_produs ${id_produs} not found`);
            }
        }

        // Return a success response
        return res.status(201).json({
            message: 'Order created successfully',
            orderId: nextId
        });
    } catch (err) {
        console.error('Error creating order:', err);
        return res.status(500).json({ error: 'Failed to create order' });
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
};