const express = require("express");

const router = express.Router();

router.get("/test-route", (request, response) => {
    response.json({
        message: "Hello from test route!"
    });
});

module.exports = router;