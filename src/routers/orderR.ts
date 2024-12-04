import express from "express"
import { getAllOrders, createOrder, updateStatusOrder, deleteOrder } from "../controllers/orderC"
import { verifyAddOrder, verifyEditStatus } from "../middlewares/orderValidation"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())
app.get(`/`, [verifyToken, verifyRole(["CASHIER","MANAGER"])], getAllOrders)
app.post(`/create`, [verifyToken, verifyRole(["CASHIER"]), verifyAddOrder], createOrder)
app.put(`/edit/:id`, [verifyToken, verifyRole(["CASHIER"]), verifyEditStatus], updateStatusOrder)
app.delete(`/delete/:id`, [verifyToken, verifyRole(["MANAGER"])], deleteOrder)

export default app