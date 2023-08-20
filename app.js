
const form = document.getElementById('tailorForm');
const dressList = document.getElementById('dressList');
const totalElement = document.getElementById('total');
const daySelect = document.getElementById('taskDay');
 const dressTypeSelect = document.getElementById('dressType');
 const priceInput = document.getElementById('price');

    dressTypeSelect.addEventListener('change', setPrice);
  
    const prices = {
        Lass: 3.5,
        Sadha: 2.0,
        Joint: 5
    };

    function setPrice() {
        const selectedDressType = dressTypeSelect.value;
        const price = prices[selectedDressType];

        // Update the price input field
        priceInput.value = price;
    }
    let tasksByDay = {};
    const dayIncomeElements = {};
// At the beginning of your script
window.addEventListener('load', function() {
    let storedTasksByDay = localStorage.getItem('tasksByDay');
    const storedDayIncomeElements = localStorage.getItem('dayIncomeElements');
    const storedTotal = localStorage.getItem('total');

    if (storedTasksByDay) {
        tasksByDay = JSON.parse(storedTasksByDay);
        for (const day in tasksByDay) {
            updateDayTasks(day);
        }
        updateTotal();
    }

    if (storedDayIncomeElements) {
       
        for (const day in dayIncomeElements) {
            updateDayIncome(day);
        }
    }
    
    if (storedTotal) {
        totalElement.textContent = storedTotal;
    }
});

   
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const dressName = document.getElementById('dressType').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const selectedDay = daySelect.value;

    const dressTotal = price * quantity;
    
    if (!tasksByDay[selectedDay]) {
        tasksByDay[selectedDay] = [];
        dayIncomeElements[selectedDay] = document.createElement('p');
        dressList.appendChild(dayIncomeElements[selectedDay]);
    }
    
    const newTask = {
        dressName: dressName,
        price: price,
        quantity: quantity,
        total: dressTotal
    };
    
    tasksByDay[selectedDay].push(newTask);
    
    updateDayTasks(selectedDay);
    updateTotal();
    updateDayIncome(selectedDay);

    localStorage.setItem('tasksByDay', JSON.stringify(tasksByDay));

    // Clear form inputs
    document.getElementById('dressType').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    
});



function updateDayIncome(selectedDay) {
    const dayTasks = tasksByDay[selectedDay];
    let dayTotalIncome = 0;

    dayTasks.forEach(task => {
        dayTotalIncome += task.total;
    });

    dayIncomeElements[selectedDay].textContent = ` Income: $${dayTotalIncome.toFixed(2)}`;
    localStorage.setItem('dayIncomeElements', JSON.stringify(dayIncomeElements));
}

const clearAllButton = document.getElementById('clearAllButton');
clearAllButton.addEventListener('click', clearAllTasks);

function clearAllTasks() {
   
    dressList.innerHTML = '';
    localStorage.removeItem('tasksByDay');
    totalElement.innerHTML = localStorage.getItem(total);
    localStorage.setItem('total',"0")
}

function removeTask(selectedDay, taskIndex) {
    tasksByDay[selectedDay].splice(taskIndex, 1);
    updateDayTasks(selectedDay);
    updateTotal();
    updateDayIncome(selectedDay);
    localStorage.setItem('tasksByDay', JSON.stringify(tasksByDay));
}

function updateDayTasks(selectedDay) {
    const dayContainer = document.getElementById(selectedDay) || createDayContainer(selectedDay);
    const dayTasks = tasksByDay[selectedDay];
    
    dayContainer.innerHTML = `<h3 class="text-primary">${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}</h3>`;
    
    dayTasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item ,p-5';
        listItem.innerHTML = `
            ${task.dressName} - $${task.price.toFixed(2)} x ${task.quantity} = $${task.total.toFixed(2)}
            <button class="btn btn-sm btn-danger float-end" onclick="removeTask('${selectedDay}', ${dayTasks.indexOf(task)})">Remove</button>
        `;
        dayContainer.appendChild(listItem);
    });
}

function createDayContainer(selectedDay) {
    const newDayContainer = document.createElement('div');
    newDayContainer.id = selectedDay;
    dressList.appendChild(newDayContainer);
    return newDayContainer;
}

function updateTotal() {
    let total = 0;
    for (const day in tasksByDay) {
        tasksByDay[day].forEach(task => {
            total += task.total;
        });
    }
    totalElement.textContent = total.toFixed(2);
    localStorage.setItem('total', total.toFixed(2));
}