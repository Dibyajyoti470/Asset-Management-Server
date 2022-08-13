require("dotenv").config();
require("express-async-errors");

// extra security packages
const cors = require("cors");

// express
const express = require("express");
const app = express();

const connectDB = require("./db/connect");

// routers
const { authRouter, assetRouter, categoryRouter } = require("./routes");

// middlewares
const {
  authenticateUser,
  routeNotFoundHandler,
  errorHandler,
} = require("./middlewares");

app.use(express.json());
app.use(cors());

// routes
app.get("/api/v1", (req, res) => {
  res.send("You are all good.");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/asset", authenticateUser, assetRouter);
app.use("/api/v1/asset/category", authenticateUser, categoryRouter);
app.use(routeNotFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB Atlas.");
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
