import { Router } from "express";
import { getOrders, createOrder } from "../controllers/orderController";

export const orderController = Router();

orderController.get('/orders', getOrders);
orderController.post('/order', createOrder);

//TODO: 
// get order by id
// get order by coffee shop id