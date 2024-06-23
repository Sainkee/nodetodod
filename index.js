const { log } = require("console");
const fs = require("fs");
const path = require("path");
const readline = require("node:readline");

let id = 1; // Initialize ID counter

const filePath = path.join(__dirname, "task.json");
log(filePath);

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify([]));
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const addTodo = (task) => {
  const todos = getTodo();
  const uid = id++;
  todos.push({ id: uid, task, completed: false });
  setTodo(todos);
  console.log(`Task added with ID: ${uid}`);
};

const getTodo = () => {
  const todos = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(todos);
};

const setTodo = (todos) => {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
};

const viewAll = () => {
  const todos = getTodo();
  if (todos.length === 0) {
    console.log("No tasks found.");
  } else {
    todos.forEach((todo) => {
      console.log(
        `ID: ${todo.id}, Task: ${todo.task}, Completed: ${todo.completed}`
      );
    });
  }
};

const deleteTodo = (id) => {
  const todos = getTodo();
  if (todos.length === 0) {
    console.log("There is no todo to delete.");
    return;
  }
  const filtered = todos.filter((item) => item.id !== +id);
  if (todos.length === filtered.length) {
    console.log("ID didn't match, try again with the correct ID");
    return;
  }

  setTodo(filtered);
  console.log("Todo deleted successfully.");
};

const updateTodo = (id, newTask) => {
  let todos = getTodo();
  let found = false;
  todos = todos.map((todo) => {
    if (todo.id === +id) {
      found = true;
      return { ...todo, task: newTask };
    }
    return todo;
  });
  if (found) {
    setTodo(todos);
    console.log(`Task with ID: ${id} has been updated.`);
  } else {
    console.log(`No task found with ID: ${id}`);
  }
};

const markCompleted = (id) => {
  let todos = getTodo();
  let found = false;
  todos = todos.map((todo) => {
    if (todo.id === +id) {
      found = true;
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  if (found) {
    setTodo(todos);
    console.log(`Task with ID: ${id} has been marked as completed.`);
  } else {
    console.log(`No task found with ID: ${id}`);
  }
};

function todoManage() {
  rl.question(
    "Choose an option:\n 1. Add a task\n 2. View all tasks\n 3. Delete a task\n 4. Update a task\n 5. Mark task as completed\n 6. Exit\n",
    (answer) => {
      switch (answer) {
        case "1":
          rl.question("What is your task? ", (ans) => {
            if (!ans) {
              console.log("Task cannot be empty!");
            } else {
              addTodo(ans);
            }
            todoManage(); // Recurse back to the main menu
          });
          break;
        case "2":
          viewAll();
          todoManage(); // Recurse back to the main menu
          break;
        case "3":
          viewAll();
          rl.question("Enter the ID of the task to delete: ", (id) => {
            deleteTodo(id);
            todoManage(); // Recurse back to the main menu
          });
          break;
        case "4":
          viewAll();
          rl.question("Enter the ID of the task to update: ", (id) => {
            rl.question("Enter the new task: ", (newTask) => {
              updateTodo(id, newTask);
              todoManage(); // Recurse back to the main menu
            });
          });
          break;
        case "5":
          viewAll();
          rl.question(
            "Enter the ID of the task to mark as completed: ",
            (id) => {
              markCompleted(id);
              todoManage(); // Recurse back to the main menu
            }
          );
          break;
        case "6":
          console.log("Goodbye!");
          rl.close(); // Properly close the readline interface
          break;
        default:
          console.log("Invalid option, please try again.");
          todoManage(); // Recurse back to the main menu
          break;
      }
    }
  );
}

todoManage();
