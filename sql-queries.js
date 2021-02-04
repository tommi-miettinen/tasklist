const GET_TASKS = () => `select * from tasks`;
const GET_SUBTASKS = () => `select * from subtasks`;
const COMPLETE_TASK = (id, completed) =>
  `update tasks set completed = "${completed}" where id = ${id}`;
const COMPLETE_SUBTASK = (id, completed) =>
  `update subtasks set completed = "${completed}" where id = ${id}`;
const UPDATE_TASKTIMER = (id, duration) =>
  `update tasks set duration = ${duration} where id = ${id}`;
const DELETE_TASK = (id) => `delete from tasks where id = ${id}`;
const DELETE_SUBTASK = (id) => `delete from subtasks where id = ${id}`;
const INSERT_TASK = (content, duration) =>
  `insert into tasks(content, completed, duration) values("${content}", "false", ${duration})`;
const INSERT_SUBTASK = (content, task_id) =>
  `insert into subtasks(content, completed, task_id) values("${content}", "false", ${task_id} )`;

module.exports = {
  GET_TASKS,
  GET_SUBTASKS,
  COMPLETE_TASK,
  COMPLETE_SUBTASK,
  UPDATE_TASKTIMER,
  DELETE_TASK,
  DELETE_SUBTASK,
  INSERT_TASK,
  INSERT_SUBTASK,
};
