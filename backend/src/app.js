const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const http = require('http');
const { initSocket } = require("./services/socket.service");
const authRoutes = require("./routes/auth.routes");
const researchRoutes = require("./routes/research.routes");

const cors = require("cors");

const server = http.createServer(app);

//Socket.io
initSocket(server);

//middlewares
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//routes
app.get("/", (req, res) => {
    res.json({ status: "ok", message: "Lumen API is running" });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.status(204).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/research", researchRoutes);




module.exports = { app, server };