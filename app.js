document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("wageForm");
    const tasksContainer = document.getElementById("tasksContainer");
    const calculateWeeklyIncomeButton = document.getElementById("calculateWeeklyIncomeButton");
    const weeklyIncomeDisplay = document.getElementById("totalincome"); // Add an element to display weekly income
    // Load tasks from local storage and display them
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        savedTasks.forEach(task => {
            const taskCard = createTaskCard(task);
            tasksContainer.appendChild(taskCard);
        });
    }

    // Save tasks to local storage
    function saveTasks(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Create a task card
    function createTaskCard(task, index) {
        const taskCard = document.createElement("div");
        taskCard.classList.add("col-md-4", "mb-3");
        taskCard.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${task.taskName}</h5>
                    <p class="card-text">${task.day}</p>
                    <p class="card-text">Wage: ${task.wage.toFixed(2)}</p>
                    <p class="card-text">Quantity: ${task.quantity}</p>
                    <p class="card-text">Income: ${task.income.toFixed(2)}</p>
                    <button class="btn btn-danger btn-sm" data-index="${index}">Remove</button>
                </div>
            </div>
        `;
    
        taskCard.querySelector("button").addEventListener("click", function () {
            removeTask(index);
            console.log(index)
        });
    
        return taskCard;
    }
    
    function removeTask(index) {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.splice(index, 1);
        saveTasks(savedTasks);
        updateTasksDisplay(savedTasks);
        totalWeeklyIncome();
    }
    function updateTasksDisplay(tasks) {
        tasksContainer.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskCard = createTaskCard(task, index);
            tasksContainer.appendChild(taskCard);
        });
    }

    document.getElementById("clearAllButton").addEventListener("click", clearAllTasks);
    
    function clearAllTasks() {
        localStorage.removeItem("tasks");
        updateTasksDisplay([]); 
        totalWeeklyIncome();
        // Clear the displayed tasks
    }
    calculateWeeklyIncomeButton.addEventListener("click", totalWeeklyIncome);
    function totalWeeklyIncome () {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const totalWeeklyIncome = savedTasks.reduce((total, task) => total + task.income, 0);
        weeklyIncomeDisplay.textContent = `Total Weekly Income:${totalWeeklyIncome.toFixed(2)}`;
    }


   
     // Load saved tasks on page load
     loadTasks();

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission

        const day = document.getElementById("day").value;
       
        const taskName = document.getElementById("taskName").value;
        const wage = parseFloat(document.getElementById("wage").value);
        const quantity = parseFloat(document.getElementById("quantity").value);
      

        // Save task data to local storage
        const newTask = {
            day: day,
            taskName: taskName,
            wage: wage,
            quantity: quantity,
            income: wage * quantity
        };

        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
        savedTasks.push(newTask);
        saveTasks(savedTasks);

        // Create and display task card
        const taskCard = createTaskCard(newTask);
        tasksContainer.appendChild(taskCard);

        // Clear form inputs
        form.reset();
    });
   
});