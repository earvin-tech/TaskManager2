const express = require("express");
const testRoute = require("./routes/testRoute");
const { default: errorHandler } = require("./middleware/errorHandler");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const subtaskRoutes = require("./routes/subtaskRoutes");

const app = express();

app.use(express.json());

app.get('/test', (request, response) => {
    response.send("Hello World");
});

app.use("/test", testRoute);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/subtasks", subtaskRoutes);

app.use(errorHandler);

module.exports = app;