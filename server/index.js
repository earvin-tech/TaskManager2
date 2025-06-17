const express = require("express");
const testRoute = require("./routes/testRoute");
const { default: errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.get('/test', (request, response) => {
    response.send("Hello World");
});

app.use("/test", testRoute);

app.use(errorHandler);

module.exports = app;