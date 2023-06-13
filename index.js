import express from "express";

const app = express();

app.use(express.static("public"));

app.get("/", (req, res) => {
  req.redirect("/index.html");
});

let todoArray = [{ text: "aaaaa", isCompleted: false, timestamp: "18:00" }];

app.get("/todoArray", (req, res) => {
  res.send(todoArray);
});

app.post("/todoArray", (req, res) => {
  todoArray = req.body;
  res.send("ok");
})

app.listen(3001);
