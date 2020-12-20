import React from "react";
import TaskItem from "../Task-item/Task-item";
import "./Task-container.css";

const TaskContainer = ({ tasks, subtasks, fetchTasks }) => {
  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          fetchTasks={fetchTasks}
          key={task.id}
          subtasks={subtasks.filter((subtask) => subtask.task_id === task.id)}
          task={task}
        />
      ))}
    </div>
  );
};

export default TaskContainer;
