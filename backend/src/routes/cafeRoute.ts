import { Router } from "express";
import { getCafes, getCafeInventories, deleteCafeInventory, updateCafeInventory } from "../controllers/cafeController";

export const cafeRouter = Router();

cafeRouter.get('/cafes', getCafes);
cafeRouter.get('/cafeInventories', getCafeInventories);
cafeRouter.put('/cafeInventory', updateCafeInventory);
cafeRouter.delete('/cafeInventory', deleteCafeInventory);