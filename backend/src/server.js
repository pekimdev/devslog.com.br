const express = require("express");
const app = express();

const cors = require("cors");

require("infra/config/config.js");

const userRoutes = require("routes/userRoutes.js");
const postRoutes = require("routes/postRoutes.js");
const commentRoutes = require("routes/commentRoutes.js");
const responseRoutes = require("routes/responseRoutes.js");

app.use(cors());

app.use(express.json());

app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);
app.use(responseRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

module.exports = app;
