import { Router } from "express";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../controllers/productController";

export const productRouter = Router();

productRouter.get('/products', getProducts);
productRouter.post('/product', addProduct);
productRouter.put('/products/:id', updateProduct);
productRouter.delete('/products/:id_produs', deleteProduct);