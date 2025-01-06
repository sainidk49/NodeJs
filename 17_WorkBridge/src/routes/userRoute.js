import express from "express";
import { createUser, getUsers, getSingleUser, deleteUser, updateUser } from "../controller/userController.js"
const route = express.Router()

route.post("/createUser", createUser)
route.post("/getUsers", getUsers)
route.post("/getUser", getSingleUser)
route.post("/user/update", updateUser)
route.post("/user/delete", deleteUser)

export default route;