require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing");
    console.log("MONGO_URI:", process.env.MONGO_URI);
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exit(1);
  }
})();
