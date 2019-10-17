import { Router } from "express";
import auth from "./auth";
import user from "./user";
import swagger from "./swagger";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);
routes.use("/swagger", swagger);

export default routes;