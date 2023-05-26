import express from "express";
import handlebars from "express-handlebars";
import { routerCarts } from "./routes/cart.router.js";
import { routerProductos } from "./routes/products.router.js";
import { routerVistaProductos } from "./routes/productos.vista.router.js";
import { routerVistaRealTimeProducts } from "./routes/realTimeProducts.vista.router.js";//vista en tiempo real de productos
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./manager/ProductManager.js";

const app = express();
const port = 8080;

app.use(express.urlencoded({extended:true}))
app.use(express.json());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

app.use("/api/products", routerProductos);
app.use("/api/carts", routerCarts);

//HTML REAL TIPO VISTA
app.use("/vista/products", routerVistaProductos);

//VISTA Sockets
app.use("/vista/realtimeproducts", routerVistaRealTimeProducts);



//Url error
app.get('*', (req, res) => {
  return res.status(404).json({
    status: "Error",
    msg: "page not found",
    data: {},
  })
});

const httpServer = app.listen(port, () => {
  console.log('Servidor escuchando en el puerto ' + port);
});

  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socket) => {
  const pm = new ProductManager();
    socket.on("new-product-created", (newProduct) => {
      const productList = pm.getProducts();
      var repeatcode =false;
      productList.forEach(product => {
        if(newProduct.code==product.code){
          repeatcode=true
        }
      });
      if (repeatcode) {
        socketServer.emit("repeat-code",repeatcode);
      }else{
        const productCreated = pm.addProduct(newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnails, newProduct.code, newProduct.stock, newProduct.status,newProduct.category);
      if (productCreated) {
        const productList = pm.getProducts();
        socketServer.emit("products", productList);
      } else {
        socketServer.emit("products", productCreated);
      }
      }
      
    });
  
    socket.on("delete-product", async (idToDelete) => {
      pm.deleteProduct(idToDelete);
      socketServer.emit("delete-product-in-table", idToDelete);
    })
  });
