import { Router } from "express";
import { UserController } from "../controller/userController";
import { checkRole } from "../middleware/checkRole";
import { checkJwt } from "../middleware/checkJwt";
import { Container } from "typedi";

const router = Router();

const userController = Container.get(UserController);

//Get all users
router.get("/", [checkJwt, checkRole(["ADMIN"])], userController.getAll);

// Get one user
router.get(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    userController.getOneById
);

//Create a new user
router.post("/", [checkJwt, checkRole(["ADMIN"])], userController.newUser);

//Edit one user
router.patch(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    userController.editUser
);

//Delete one user
router.delete(
    "/:id([0-9]+)",
    [checkJwt, checkRole(["ADMIN"])],
    userController.deleteUser
);

export default router;