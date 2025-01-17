const express = require("express");
const app = express();

const mainRouter = require("./routers/mainRouter");
const auto = require("./routers/auto");

const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));

auto.timers();
