import express from "express";
import homeController from "../controller/homeController";
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/",homeController.getHomePage);
    router.get("/about",homeController.getAboutPage);
    router.get("/linh", (req, res)=>{
        return res.send("hello linh ")
    });
    return app.use("/",router)
}

module.exports = initWebRoutes;