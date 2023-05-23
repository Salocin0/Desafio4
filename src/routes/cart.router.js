import express from "express";
import CartManager from "../manager/CartManager.js";

export const routerCarts = express.Router();

//get todos + limit
routerCarts.get('/', (req, res) => {
  const cm = new CartManager()  
  const carts = cm.getCarts()
  const limit = req.query.limit || -1;
  
    if(limit==-1 && carts.length>0){
      return res.status(200).json({
        status: "sucess",
        msg: "Found all carts",
        data: carts,
      })
    }else if(limit!=-1 && carts.length>0){
      return res.status(200).json({
        status: "sucess",
        msg: "Found "+ limit+ " carts",
        data: carts.slice(0, limit),
      })
    }else{
      return res.status(404).json({
        status: "Error",
        msg: "Carts not found",
        data: carts.slice(0, limit),
      })
    }
  });
  
  //getById
  routerCarts.get('/:id', (req, res) => {
    const cm = new CartManager()
    const cart = cm.getCartById(req.params.id);
    if (typeof cart !== 'string') {
      return res.status(200).json({
        status: "sucess",
        msg: "Cart found",
        data: cart,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Cart with id " + req.params.id + " not found",
        data: {},
      })
    }
  });

  //deletebyid
  routerCarts.delete("/:id", (req, res) => {
    const cm = new CartManager()
    const id = req.params.id;
    const carts = cm.deleteCart(id);
    
    if (typeof carts !== 'string') {
      return res.status(200).json({
        status: "sucess",
        msg: "Carts deleted",
        data: carts,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "Carts with id " + req.params.id + " not found",
        data: {carts},
      })
    }
  });

  //new
  routerCarts.post("/", (req, res) => {
    const cm = new CartManager()
    const cart = cm.addCart()
    return res.status(201).json({
      status: "Sucess",
      msg: "Cart created sucess",
      data: {cart},
    })
  });
  routerCarts.post("/:cid/product/:pid", (req, res) => {
    const cm = new CartManager()
    const cartId = req.params.cid
    const productId = req.params.pid
    const cart = cm.addProductToCart(cartId,productId)
    if (typeof cart !== 'string') {
      return res.status(200).json({
        status: "sucess",
        msg: "Product added",
        data: cart,
      })
    } else {
      return res.status(404).json({
        status: "Error",
        msg: "error to add product: " + productId + " to cart: "+ cartId,
        data: {cart},
      })
    }
  });