import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import DoneIcon from "@material-ui/icons/Done";
import TimerIcon from "@material-ui/icons/Timer";
import TimerOffIcon from "@material-ui/icons/TimerOff";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import CloseIcon from "@material-ui/icons/Close";
import "./Task-item.css";

const TaskItem = ({ task, subtasks, fetchTasks }) => {
  const [timer, setTimer] = useState(task.duration);
  const [isActive, setIsActive] = useState(false);
  const [subtaskContent, setSubtaskContent] = useState("");
  const [showSubtasks, setShowSubtasks] = useState(false);
  const decrement = React.useRef(null);

  useEffect(() => {
    window.addEventListener("beforeunload", updateTimerBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", updateTimerBeforeUnload);
  });

  const updateTimerBeforeUnload = () =>
    navigator.sendBeacon(`http://localhost:8080/tasks/${task.id}/${timer}`);

  const handleStart = () => {
    setIsActive(true);
    decrement.current = setInterval(() => {
      if (timer <= 0) {
        setTimer(0);
        handlePause();
        return;
      }
      setTimer((timer) => timer - 1);
    }, 1000);
  };

  const handlePause = () => {
    clearInterval(decrement.current);
    setIsActive(false);
    updateTimer(task.id);
  };

  const updateTimer = async (id) => {
    await axios.post(`http://localhost:8080/tasks/${task.id}/${timer}`);
  };

  const formatTime = (timer) => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  const createSubtask = async (id) => {
    await axios.post(`http://localhost:8080/subtasks/${id}`, {
      content: subtaskContent,
    });
    setSubtaskContent("");
    fetchTasks();
  };

  const completeTask = async (id) => {
    handlePause();
    await axios.patch(`http://localhost:8080/tasks/${id}`, {
      completed: task.completed ? false : true,
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8080/tasks/${id}`);
    fetchTasks();
  };

  const completeSubtask = async (id, completed) => {
    await axios.patch(`http://localhost:8080/subtasks/${id}`, {
      completed: completed ? false : true,
    });
    fetchTasks();
  };

  const deleteSubtask = async (id) => {
    await axios.delete(`http://localhost:8080/subtasks/${id}`);
    fetchTasks();
  };

  const TaskOpenArrowIcon = () => {
    if (showSubtasks)
      return (
        <KeyboardArrowUpIcon
          id="icon"
          onClick={() => setShowSubtasks(!showSubtasks)}
        />
      );
    else
      return (
        <KeyboardArrowDownIcon
          id="icon"
          onClick={() => setShowSubtasks(!showSubtasks)}
        />
      );
  };

  const TaskCompletedStateIcon = () => {
    if (task.completed)
      return (
        <KeyboardBackspaceIcon
          id="icon"
          onClick={() => completeTask(task.id)}
        />
      );
    else return <DoneIcon id="icon" onClick={() => completeTask(task.id)} />;
  };

  const SubtaskCompletedStateIcon = ({ subtask }) => {
    if (subtask.completed)
      return (
        <CloseIcon
          id="icon"
          onClick={() => completeSubtask(subtask.id, subtask.completed)}
        />
      );
    else
      return (
        <DoneIcon
          id="icon"
          onClick={() => completeSubtask(subtask.id, subtask.completed)}
        />
      );
  };

  const StopwatchIcon = () => {
    if (isActive && !task.completed)
      return <TimerOffIcon id="icon" onClick={() => handlePause()} />;
    else return <TimerIcon id="icon" onClick={() => handleStart()} />;
  };

  return (
    <div>
      <div className="task-item">
        <div style={{ display: "flex" }}>
          <TaskOpenArrowIcon />
          <div style={{ textTransform: "capitalize" }}>{task.content}</div>
        </div>
        <div style={{ display: "flex" }}>
          <TaskCompletedStateIcon />
          <StopwatchIcon />
          {!task.completed && <div>{formatTime(timer)}</div>}
          <DeleteForeverIcon id="icon" onClick={() => deleteTask(task.id)} />
        </div>
      </div>
      {showSubtasks && (
        <div>
          {subtasks.map((subtask) => (
            <div
              style={{
                textDecoration: subtask.completed ? "line-through 2px" : "",
              }}
              key={subtask.id}
              className="subtask"
            >
              {subtask.content}
              <div>
                <SubtaskCompletedStateIcon subtask={subtask} />
                <DeleteForeverIcon
                  id="icon"
                  onClick={() => deleteSubtask(subtask.id)}
                />
              </div>
            </div>
          ))}
          <div className="subtask-input-container">
            <input
              type="text"
              className="subtask-input"
              onChange={(e) => setSubtaskContent(e.target.value)}
              value={subtaskContent}
            />
            <button
              className="subtask-submit-btn"
              onClick={() => createSubtask(task.id)}
            >
              Lisää tehtävä
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
