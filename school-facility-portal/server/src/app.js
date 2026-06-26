const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ message: "School Facility Portal API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/issues", require("./routes/issueRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
