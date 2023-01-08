import express from "express";
import "express-async-errors";

const app = express();

app.get("/", (request, response) => {
    response.send("Up and running!!!");
});

export default app;
