import express from "express";
import { create, deleteUser, getUser, getUsers, updateUser } from "../controller/userController.js";

const route = express.Router();

route.post("/create", create)
route.post("/users", getUsers)
route.post("/user/:id", getUser)
route.post("/user/update/:id", updateUser)
route.post("/user/delete/:id", deleteUser)

export default route;