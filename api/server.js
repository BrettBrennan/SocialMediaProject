const express = require("express");
const app = express();

app.use(express.json({ extended: false }));

const db = require("./models/");
db.sequelize.sync();

app.get("/", (req, res) => res.json({ msg: "Welcome to the Roma-Media API" }));

//Define routes

app.use("/api/users", require("./routes/users"));
app.use("/api/user", require("./routes/user"));
app.use("/api/post", require("./routes/post"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/section", require("./routes/section"));
app.use("/api/sections", require("./routes/sections"));
app.use("/api/comment", require("./routes/comment"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
