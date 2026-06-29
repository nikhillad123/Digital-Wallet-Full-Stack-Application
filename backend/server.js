require("dotenv").config();
require("./src/config/env");

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
    console.log("Server is running at port 3000!");
});