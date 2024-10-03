import express from "express";
import { createUser, getUsers, getSingleUser, deleteUser, updateUser } from "../controller/userController.js"
const route = express.Router()

route.post("/create", createUser)
route.post("/users", getUsers)
route.post("/user/:id", getSingleUser)
route.post("/user/update/:id", updateUser)
route.post("/user/delete/:id", deleteUser)

export default route;