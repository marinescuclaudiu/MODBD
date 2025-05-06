import { Router } from "express";
import { addCustomer, getCustomers } from "../controllers/customerController";

export const customerRouter = Router();

customerRouter.get('/customers', getCustomers);
customerRouter.post('/customer', addCustomer);