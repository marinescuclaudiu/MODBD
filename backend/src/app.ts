import express from "express";
import { cafeRouter } from "./routes/cafeRoute";
import { productRouter } from "./routes/productRoute";
import { employeeRouter } from "./routes/employeeRoute";
import { orderController } from "./routes/orderRoute";
import { customerRouter } from "./routes/customerRoute";

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());


app.use("/api", cafeRouter);
app.use("/api", productRouter);
app.use('/api', employeeRouter);
app.use('/api', customerRouter);
app.use('/api', orderController);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
