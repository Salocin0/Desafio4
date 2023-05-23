import express from "express";
import { routerCarts } from "./routes/cart.router.js";
import { routerProductos } from "./routes/products.router.js";

const app = express();
const port = 8080;
app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.use("/api/products", routerProductos);
app.use("/api/carts", routerCarts);

//Url error
app.get('*', (req, res) => {
  return res.status(404).json({
    status: "Error",
    msg: "page not found",
    data: {},
  })
});

app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});
