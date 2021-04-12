const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.js");
// const postsRoutes = require("./routes/posts.js");

require("dotenv/config.js");

const path = __dirname + "/views";
const DB_URL = process.env.DB_URL;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", authRoutes);
// app.use("/posts", postsRoutes);

app.get("/", (req, res) => {
	res.sendFile(`${path}/index.html`);
});

async function connectToDB() {
	try {
		await mongoose.connect(DB_URL, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(`Error connecting to MongoDB: ${err}`);
		process.exit(1);
	}
}

connectToDB();

app.listen(PORT, () => {
	console.log(`Server running on port: http://localhost:${PORT}`);
});