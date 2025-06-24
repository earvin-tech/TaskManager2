const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "test") {
        console.error("❌ Error caught by errorHandler:", err);
    }
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

module.exports = errorHandler;