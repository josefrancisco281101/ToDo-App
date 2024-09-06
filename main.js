document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form");
  const input = document.querySelector("#input");
  const showTasks = document.querySelector("#showTasks");
  const all = document.querySelector("#all");
  const active = document.querySelector("#active");
  const completed = document.querySelector("#completed");
  const deleteAll = document.querySelector("#deleteAll");

  let taskId = 0;
  let tasks = [];
  let currentView = "all";

  function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      tasks = JSON.parse(storedTasks);
      taskId = tasks.length ? tasks[tasks.length - 1].id : 0; 
    }
    updateDOM();
  }

  function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (title) {
      taskId++;
      const task = {
        id: taskId,
        title: title,
        completed: false,
      };
      tasks.push(task);
      create_task(task, showTasks);
      input.value = "";
      saveTasksToLocalStorage(); 
      updateDOM();
    }
  });

  
  function create_task({ id, title, completed }, list) {
    const li = document.createElement("li");
    li.innerHTML = `
      <label for="inputCheck_${id}">
        <input type="checkbox" id="inputCheck_${id}" ${
      completed ? "checked" : ""
    }>
        ${title}
      </label>
      ${
        completed && currentView === "completed"
          ? '<button class="delete-btn"><i class="fa-solid fa-trash"></i></button>'
          : ""
      }
    `;

    li.querySelector('input[type="checkbox"]').addEventListener(
      "change",
      (event) => {
        completeTask(id, event.target.checked);
      }
    );

    if (completed && currentView === "completed") {
      li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteTask(id);
      });
    }

    if (completed) {
      li.classList.add("completed");
    }

    list.appendChild(li);
  }

 
  function completeTask(id, isCompleted) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex].completed = isCompleted;
      saveTasksToLocalStorage(); 
      updateDOM();
    }
  }

  
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    saveTasksToLocalStorage(); 
    updateDOM();
  }

  function deleteCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasksToLocalStorage(); 
    updateDOM();
  }

 
  function showTasksInDOM(tasksToShow) {
    showTasks.innerHTML = "";
    tasksToShow.forEach((task) => {
      create_task(task, showTasks);
    });
  }

    function updateDOM() {
    if (currentView === "all") {
      showTasksInDOM(tasks);
      deleteAll.style.display = "none";
    } else if (currentView === "active") {
      const uncompletedTasks = tasks.filter((task) => !task.completed);
      showTasksInDOM(uncompletedTasks);
      deleteAll.style.display = "none";
    } else if (currentView === "completed") {
      const completedTasks = tasks.filter((task) => task.completed);
      showTasksInDOM(completedTasks);
      deleteAll.style.display = completedTasks.length > 0 ? "block" : "none";
    }
  }

 
  function filterCompleted() {
    currentView = "completed";
    updateDOM();
  }

  
  function filterUncompleted() {
    currentView = "active";
    updateDOM();
  }

 
  function showAllTasks() {
    currentView = "all";
    updateDOM();
  }

    function activateButton(button) {
    all.classList.remove("active");
    active.classList.remove("active");
    completed.classList.remove("active");
    button.classList.add("active");
  }

   all.addEventListener("click", () => {
    activateButton(all);
    showAllTasks();
    form.style.display = "block";
  });

  active.addEventListener("click", () => {
    activateButton(active);
    filterUncompleted();
    form.style.display = "block";
  });

  completed.addEventListener("click", () => {
    activateButton(completed);
    filterCompleted();
    form.style.display = "none";
  });

  deleteAll.addEventListener("click", deleteCompletedTasks);

 
  loadTasksFromLocalStorage();
});
