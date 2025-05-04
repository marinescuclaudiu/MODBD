import { Router } from "express";
import { getProducts, addProduct, updateProduct } from "../controllers/productController";

export const productRouter = Router();

productRouter.get('/products', getProducts);
productRouter.post('/product', addProduct);
productRouter.put('/products/:id', updateProduct);