import express from "express";
import db from "../db.js";
import checkAuth from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(checkAuth);

//puxa as anotações daquele usuário logado e joga na variável "todos" pro ejs
router.get("/", async (req, res) => {
  const userId = req.user.id;
  const result = await db.query("SELECT * FROM todos WHERE user_id = $1", [
    userId,
  ]);
  res.render("todos.ejs", { todos: result.rows });
});

router.post("/add", async (req, res) => {
  const { title } = req.body;
  await db.query("INSERT INTO todos (title, user_id) VALUES ($1, $2)", [
    title,
    req.user.id,
  ]);
  res.redirect("/todos");
});

router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;
  await db.query("DELETE FROM todos WHERE id = $1 AND user_id = $2", [
    id,
    req.user.id,
  ]);
  res.redirect("/todos");
});

//pega os novos valores que o usuário escreve no frontend, joga na função, e usa na query
router.post("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const userId = req.user.id;

  await db.query("UPDATE todos SET title = $1 WHERE id = $2 AND user_id = $3", [
    title,
    id,
    userId,
  ]);
  res.redirect("/todos");
});

export default router;
