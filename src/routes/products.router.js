import express from "express";
import ProductManager from "../manager/ProductManager.js";

export const routerProductos = express.Router();

//get todos + limit
routerProductos.get('/', (req, res) => {
    const pm = new ProductManager()
    const products = pm.getProducts()
    const limit = req.query.limit || -1;
  
    if(limit==-1 && products.length>0){
      return res.status(200).json({
        status: "sucess",
        msg: "Found all productos",
        data: products,
      })
    }else if(limit!=-1 && products.length>0){
      return res.status(200).json({
        status: "sucess",
        msg: "Found "+ limit + " products",
        data: products.slice(0, limit),
      })
    }else{
      return res.status(404).json({
        status: "Error",
        msg: "Products not found",
        data: products.slice(0, limit),
      })
    }
  });
  
  //getById
  routerProductos.get('/:id', (req, res) => {
    const pm = new ProductManager()
    const product = pm.getProductsById(req.params.id);
    if (typeof product !== 'string') {
      return res.status(200).json({
        status: "sucess",
        msg: "Product found",
        data: product,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Product with id " + req.params.id + " not found",
        data: {},
      })
    }
  });

  //deletebyid
  routerProductos.delete("/:id", (req, res) => {
    const pm = new ProductManager()
    const id = req.params.id;
    const products = pm.deleteProduct(id);
    
    if (typeof products !== 'string') {
      return res.status(200).json({
        status: "sucess",
        msg: "Product deleted",
        data: products,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Product with id " + req.params.id + " not found",
        data: {products},
      })
    }
  });

  //editbyid
  routerProductos.put("/:id", (req, res) => {
    const pm = new ProductManager()
    const id = req.params.id;
    const datosNuevos = req.body;
    const product=pm.updateProduct(id,datosNuevos)
    if (typeof product !== 'string') {
      return res.status(200).json({
        status: "sucess",
        msg: "Product found, modified sucess",
        data: product,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Product with id " + req.params.id + " not found",
        data: {},
      })
    }
  });

  //new
  routerProductos.post("/", (req, res) => {
    const pm = new ProductManager()
    const { title,description,code,price,status= true,stock,category, thumbnails } = req.body;
    if(!title || !description || !code || !price || !status || !stock || !category){
      return res.status(400).json({
        status: "Error",
        msg: "Incomplete product. Please provide all required information.",
        data: {},
      })
    }else{
      const product=pm.addProduct(title, description, price, thumbnails, code, stock, status,category)
      if (typeof product !== 'string') {
        return res.status(200).json({
          status: "sucess",
          msg: "Product created sucess",
          data: product,
        })
      } else {
        return res.status(404).json({
          status: "Error",
          msg: "code used",
          data: {},
        })
      }
    }
  });