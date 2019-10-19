import "reflect-metadata";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./route";
import * as cors from "cors";
import * as helmet from "helmet";
import { createConnection, useContainer } from "typeorm";
import { Container } from "typedi";

useContainer(Container);
createConnection()
    .then(connection => {
        // create express app
        const app = express();

        // Call middlewares
        app.use(cors());
        app.use(helmet());
        app.use(bodyParser.json());

        //Set all routes from routes folder
        app.use("/", routes);

        // start express server
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        });

    })
    .catch(error => console.log(error));
