import express from "express";
import session from "express-session";
import passport from "passport";
import bodyParser from "body-parser";
import env from "dotenv";
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todos.js";

env.config();
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
