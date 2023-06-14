import express from "express";
import mongoose from 'mongoose';
import fs from "fs";

const app = express();

const URI = 'mongodb+srv://artyomkarapetyan29:Y3qbzbigLPtAVvUA@cluster0.habv5iw.mongodb.net/?retryWrites=true&w=majority';

app.use(express.static("public"));
app.use(express.json());

async function connect() {
  try{
    await mongoose.connect(URI);
    console.log("Connected with mongo db");
  } catch (error) {
    console.log(error);
  }
}

connect();

app.get("/", (req, res) => {
  res.redirect("/index.html");
});

let todoArray = [];

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
