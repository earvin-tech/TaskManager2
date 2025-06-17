const dotenv = require("dotenv");
const app = require("./index");
const connectDB = require("./db/connect");

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});