import express from "express";
import { authentification, changeProfile, createUser, deleteUser, getAlluser, updateUser } from "../controllers/userC";
import { verifyAddUser, verifyAuthentification, verifyUpdateUser } from "../middlewares/userValidation";
import uploadFileUser from "../middlewares/userUpload";

const app = express()
app.use(express.json())

app.get(`/`,getAlluser)
app.post(`/create`,[verifyAddUser],createUser);
app.put(`/:id`,[verifyUpdateUser],updateUser)
app.post(`/login`,[verifyAuthentification],authentification)
app.put(`/pic/:id`,[uploadFileUser.single("picture")],changeProfile)
app.delete(`/:id`,deleteUser)

export default app;