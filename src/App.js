import React, { useState, useEffect } from "react";
import TaskContainer from "./components/Task-container/Task-container";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskDuration, setNewTaskDuration] = useState(0);

  const fetchTasks = async () => {
    const result = await axios.get("http://localhost:8080/tasks");
    const result2 = await axios.get("http://localhost:8080/subtasks");
    setSubtasks(result2.data);
    setTasks(result.data);
  };

  const createTask = async (content, duration) => {
    if (newTaskContent.length > 0) {
      await axios.post("http://localhost:8080/tasks", {
        content,
        duration: parseInt(duration),
      });
      fetchTasks();
      setNewTaskContent("");
      setNewTaskDuration(0);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container">
      <TaskContainer
        fetchTasks={fetchTasks}
        subtasks={subtasks}
        tasks={tasks.filter((task) => !task.completed)}
      />
      <TaskContainer
        fetchTasks={fetchTasks}
        subtasks={subtasks}
        tasks={tasks.filter((task) => task.completed)}
      />
      <div className="inputs">
        <input
          value={newTaskContent}
          type="text"
          placeholder="Lisää tehtävä"
          className="content-input"
          onChange={(e) => setNewTaskContent(e.target.value)}
        ></input>
        <input
          value={newTaskDuration}
          type="number"
          className="duration-input"
          onChange={(e) => setNewTaskDuration(e.target.value)}
        ></input>
        <span style={{ margin: "auto", paddingRight: 10 }}>min</span>
        <button
          style={{ height: 38, margin: "auto" }}
          className="button"
          onClick={() => createTask(newTaskContent, newTaskDuration * 60)}
        >
          Lisää
        </button>
      </div>
    </div>
  );
}

export default App;
