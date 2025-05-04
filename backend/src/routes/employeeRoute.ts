import { Router } from "express";
import { getEmployees, addEmployee } from "../controllers/employeeController";

export const employeeRouter = Router();

employeeRouter.get('/employees', getEmployees);
employeeRouter.post('/employee', addEmployee);