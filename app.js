const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const queries = require("./sql-queries");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname, "build")));
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "tasklistsql.cz4hjgecmbou.eu-north-1.rds.amazonaws.com",
  user: "admin",
  password: process.env.DB_PASSWORD,
  database: "tasklist",
});

connection.connect();

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.get("/tasks", (req, res) => {
  connection.query(queries.GET_TASKS(), (error, results, fields) => {
    if (error) throw error;
    const tasks = results.map(({ id, content, completed, duration }) => {
      return {
        id,
        content,
        completed: completed === "true" ? true : false,
        duration,
      };
    });
    res.send(tasks);
  });
});

app.get("/subtasks", (req, res) => {
  connection.query(queries.GET_SUBTASKS(), (error, results, fields) => {
    if (error) throw error;
    const subtasks = results.map(({ id, content, completed, task_id }) => {
      return {
        id,
        task_id,
        content,
        completed: completed === "true" ? true : false,
      };
    });
    res.send(subtasks);
  });
});

app.post("/subtasks/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  connection.query(
    queries.INSERT_SUBTASK(content, id),
    (error, results, fields) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/tasks", (req, res) => {
  const { content, duration } = req.body;
  connection.query(
    queries.INSERT_TASK(content, duration),
    (error, results, fields) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/tasks/:id/:duration", (req, res) => {
  const { id, duration } = req.params;
  connection.query(
    queries.UPDATE_TASKTIMER(id, duration),
    (error, results, fields) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.patch("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  connection.query(
    queries.COMPLETE_TASK(id, completed),
    (error, results, fields) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  connection.query(queries.DELETE_TASK(id), (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

app.delete("/subtasks/:id", (req, res) => {
  const { id } = req.params;
  connection.query(queries.DELETE_SUBTASK(id), (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

app.patch("/subtasks/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  connection.query(
    queries.COMPLETE_SUBTASK(id, completed),
    (error, results, fields) => {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
