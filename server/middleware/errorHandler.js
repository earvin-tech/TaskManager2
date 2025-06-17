export default function errorHandler(err, request, response) {
    console.log(err.stack);

    const statusCode = response.statusCode && response.statusCode !== 200 ? response.statusCode : 500;

    response.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : "hidden",
    });
}