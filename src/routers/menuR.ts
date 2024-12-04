import express from "express";
import { getAllMenus,createMenu,updateMenu, deleteMenu, changePicture } from "../controllers/menuC";
import { verifyAddMenu, verifyUpdateMenu } from "../middlewares/verifyMenu";
import uploadFileMenu from "../middlewares/menuUpload";
import { verifyRole, verifyToken } from "../middlewares/authorization";

const app = express()
app.use(express.json())

app.get(`/`,[verifyToken, verifyRole(["CHASIER","MANAGER"])],getAllMenus)
app.post(`/create`,[verifyToken,verifyRole(["MANAGER"]),uploadFileMenu.single("picture"),verifyAddMenu],createMenu)
app.put(`/:id`,[verifyToken,verifyRole(["MANAGER"]),uploadFileMenu.single("picture") ,verifyUpdateMenu],updateMenu)
// app.put(`/pic/:id`,[verifyToken,verifyRole(["MANAGER"]),uploadFileMenu.single("picture")],changePicture)
app.delete(`/:id`,[verifyToken,verifyRole(["MANAGER"])],deleteMenu)

export default app