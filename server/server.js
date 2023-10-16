const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const dotenv = require("dotenv");
const cors = require("cors");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_doc/swagger.json");

dotenv.config();

const app = express();
app.use(express.json()); // to accept json data

app.use(
  cookieSession({
    name: "session",
    keys: ["sawhil"],
    maxAge: 24 * 60 * 60 * 100,
  })
);


app.use(cors());
app.options("*", cors());

// -------------------------- ROUTES ------------------------------ //
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/userRoute"));
app.use("/game", require("./routes/gameRoutes"));
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", require("./routes/userRoute"));
// ---------------------- MIDDLEWARE ----------------------------- //
app.use(notFound);
app.use(errorHandler);

// ---------------------- DEPLOYMENT ----------------------------- //
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

module.exports = app;
