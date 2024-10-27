const express = require("express");
const mongoose = require("mongoose");
const stockRoutes = require("./routes/stockRoutes");
require("dotenv").config();
const app = express();
const PORT = 3000;

mongoose
	.connect(process.env.mongo_url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("Connected to MongoDB"))
	.catch((error) => console.error(error));

app.use(express.json());
app.use("/api", stockRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
