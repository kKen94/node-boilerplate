import { Router } from "express";
import { swaggerUi } from "swagger-ui-express";
import { specs } from "../helper/swagger";

const router = Router();

router.get('/swagger', swaggerUi.serve, swaggerUi.setup(specs));

export default router;