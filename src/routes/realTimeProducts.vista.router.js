import express from "express";
import ProductManager from "../manager/ProductManager.js";
const pm = new ProductManager();

export const routerVistaRealTimeProducts = express.Router()

routerVistaRealTimeProducts.get("/", async (req, res) => {
    const allProducts = pm.getProducts();
    return res.render("realTimeProducts", {allProducts});
});