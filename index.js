import express from "express";
import fs from "fs";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

let todoArray = [];

// Load todoArray from file on server startup
fs.readFile("todoData.json", (err, data) => {
  if (!err && data) {
    todoArray = JSON.parse(data);
  }
});

app.get("/todoArray", (req, res) => {
  res.send(todoArray);
});

app.post("/todoArray", (req, res) => {
  const { todoArray: updatedTodoArray } = req.body;
  if (Array.isArray(updatedTodoArray)) {
    todoArray = updatedTodoArray;
    // Save todoArray to file
    fs.writeFile("todoData.json", JSON.stringify(todoArray), (err) => {
      if (err) {
        res.status(500).send("Error saving todoArray");
      } else {
        res.send("ok");
      }
    });
  } else {
    res.status(400).send("Invalid todoArray data");
  }
});

app.listen(3001);
