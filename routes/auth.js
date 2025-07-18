import express from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import db from "../db.js";

const router = express.Router();
const saltRounds = 10;

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user) return done(null, false, { message: "Usuário não encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    return valid
      ? done(null, user)
      : done(null, false, { message: "Senha incorreta" });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  done(null, result.rows[0]);
});

router.get("/", (req, res) => {
  res.render("home.ejs");
});

router.get("/login", (req, res) => {
  res.render("login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/todos",
    failureRedirect: "/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register.ejs");
});

router.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash]
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/todos");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

export default router;
