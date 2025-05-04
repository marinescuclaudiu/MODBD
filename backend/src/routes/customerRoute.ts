import { Router } from "express";
import { addCustomer } from "../controllers/customerController";

export const customerRouter = Router();

customerRouter.post('/customer', addCustomer);