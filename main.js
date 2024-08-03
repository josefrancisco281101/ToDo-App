/* Los siguientes nombres de funciones son una sugerencia de funciones que necesitarás en tu programa,
sin embargo, no te limites solo a estas funciones. Crea tantas como consideres necesarias.

La estructura de cada objeto "tarea" es la siguiente:

{
  id: 1,
  title: "tarea",
  completed: false
}
*/
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
      updateDOM();
    }
  });

  // Función para añadir una nueva tarea
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

  // Función para marcar una tarea como completada o incompleta
  function completeTask(id, isCompleted) {
    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex > -1) {
      tasks[taskIndex].completed = isCompleted;
      updateDOM();
    }
  }

  // Función para borrar una tarea
  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    updateDOM();
  }

  function deleteCompletedTasks() {
    tasks = tasks.filter((task) => !task.completed);
    updateDOM();
  }

  // Función para mostrar tareas en el DOM
  function showTasksInDOM(tasksToShow) {
    showTasks.innerHTML = "";
    tasksToShow.forEach((task) => {
      create_task(task, showTasks);
    });
  }

  // Función para actualizar el DOM según la vista actual
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

  // Función para filtrar tareas completadas
  function filterCompleted() {
    currentView = "completed";
    updateDOM();
  }

  // Función para filtrar tareas incompletas
  function filterUncompleted() {
    currentView = "active";
    updateDOM();
  }

  // Mostrar todas las tareas
  function showAllTasks() {
    currentView = "all";
    updateDOM();
  }

  // Función para manejar la activación de botones
  function activateButton(button) {
    all.classList.remove("active");
    active.classList.remove("active");
    completed.classList.remove("active");
    button.classList.add("active");
  }

  // Event listeners para los botones de filtro
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

  // Leer las tareas preexistentes en el DOM y agregarlas a la lista de tareas
  document.querySelectorAll("#showTasks li").forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const title = li.textContent.trim();
    const completed = checkbox.checked;

    taskId++;
    const task = {
      id: taskId,
      title: title,
      completed: completed,
    };
    tasks.push(task);

    // Añadir event listeners a las tareas preexistentes
    checkbox.addEventListener("change", (event) => {
      completeTask(task.id, event.target.checked);
    });

    const deleteBtn = li.querySelector(".delete-btn");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        deleteTask(task.id);
      });
    }
  });

  deleteAll.addEventListener("click", deleteCompletedTasks);

  updateDOM();
});
