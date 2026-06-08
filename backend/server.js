require("dotenv").config();
const { app, server } = require("./src/app");
const connectDB = require("./src/config/db");
const port = process.env.PORT || 3000;

connectDB();

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});