import express from "express";
import ProductManager from "../manager/ProductManager.js";
export const routerVistaRealTimeProducts = express.Router()
const pm = new ProductManager();
routerVistaRealTimeProducts.get("/", async (req, res) => {
    const allProducts = pm.getProducts();
    return res.render("realTimeProducts", {allProducts});
});