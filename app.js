const todoCardHeaderInput = document.querySelector(".todo-card-header-input")
const todoList = document.querySelector(".todo-list");
const todoCardButton = document.querySelector(".todo-card-button");
// const submitTodoItemButton = document.querySelector(".submit-todo");


todoCardButton.addEventListener('click', addTodoList);
todoList.addEventListener('click', deleteCheckHeaderOrItem);
document.addEventListener('DOMContentLoaded', renderList);

//Event Listener for adding header
function addTodoList(event){
    event.preventDefault();
    const headerIndex = saveTodoHeaderLocalStorage(todoCardHeaderInput.value);
    if(headerIndex == -1){
        return;
    }
    createList = createListDOM(headerIndex, todoCardHeaderInput.value, false);
}

//Creating DOM for header
function createListDOM(headerIndex, headerValue, headerStatus){
    const todoListDiv = document.createElement("div");
    todoListDiv.classList.add("todo-card-"+headerIndex);

    if(headerStatus){
    todoListDiv.classList.add('completed');
    }

    const newTodoHeader = document.createElement("li");
    newTodoHeader.classList.add("todo-header-"+headerIndex);
    newTodoHeader.innerText = headerValue;

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn-"+headerIndex);
    editButton.innerHTML = '<i class="fa fa-pencil"></i>';

    const completedButton = document.createElement("button");
    completedButton.classList.add("complete-btn-"+headerIndex);
    completedButton.innerHTML = '<i class="fa fa-check"></i>';

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn-"+headerIndex);
    deleteButton.innerHTML = '<i class="fa fa-trash"></i>';

    const createTodoForm = document.createElement("form");
    createTodoForm.classList.add("todo-item-form-"+headerIndex);
    const createInput = document.createElement("input");
    createInput.classList.add("todo-item-input-"+headerIndex);

    const submitTodoItemButton = document.createElement("button");
    submitTodoItemButton.classList.add("submit-todo-"+headerIndex);
    submitTodoItemButton.innerHTML = '<i class="fa fa-plus-square"></i>';
    submitTodoItemButton.addEventListener('click', addTodo);

    createTodoForm.appendChild(createInput);
    createTodoForm.appendChild(submitTodoItemButton);

    const newTodoList = document.createElement("ol");
    newTodoList.classList.add("todo-list-items-"+headerIndex)

    todoListDiv.appendChild(newTodoHeader);
    todoListDiv.appendChild(editButton);
    todoListDiv.appendChild(completedButton);
    todoListDiv.appendChild(deleteButton);
    todoListDiv.appendChild(createTodoForm);
    todoListDiv.appendChild(newTodoList);

    todoList.appendChild(todoListDiv);
}

//Saving todo header to local storage
function saveTodoHeaderLocalStorage(todoHeaderValue){
    let todos = fetchLocalStorage();
    let flag = 0;
    todos.forEach(function(todo){
        if(todo["header"] == todoHeaderValue){
            flag = 1;
        }
    })
    if(!flag){
        todos.push({index: todos.length + 1, header: todoHeaderValue, status: false, todoList: []});
        localStorage.setItem("todos", JSON.stringify(todos));
        return todos.length;
    }
    else{
        window.alert("This header already exists");
        return -1;
    }
}

//Editing todo header in local storage
function editTodoHeadLocalStorage(newValue, headerIndex){
    let todos = fetchLocalStorage();
    let flag = 0;
    todos.forEach(function(todo){
        if(todo["index"] == headerIndex){
            todo["header"] = newValue;
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

//Deleteing todo header in local storage
function deleteTodoHeaderLocalStorage(headerIndex){
    let todos = fetchLocalStorage();
    todos.forEach(function(todo, index){
        if(todo["index"] == headerIndex){
            todos.splice(index, 1);
        }
    })
    localStorage.setItem('todos', JSON.stringify(todos));
}

//Toggling complete of todo header
function toggleCompleteHeaderLocalStorage(headerIndex){
    let todos = fetchLocalStorage();
    todos.forEach(function(todo){
        if(todo["index"] == headerIndex){
            todo["status"] = !todo["status"];
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

//Event Listener for adding header
function addTodo(event){
    event.preventDefault();
    element = event.target;
    headerIndex = element.classList[0].replace('submit-todo-', '');
    todoItemText = document.querySelector('.todo-item-input-'+headerIndex).value;
    let [itemIndex, headerStatus]= saveTodoLocalStoage(headerIndex, todoItemText);
    createItem = createTodoItem(todoItemText, headerIndex, itemIndex, headerStatus, false);
}

//Creating DOM for todoItem
function createTodoItem(todoTextValue, headerIndex, itemIndex, headerStatus, itemStatus){
    const newTodoDiv = document.createElement("div");
    newTodoDiv.classList.add("todo-div-"+itemIndex+'-'+headerIndex);
    if (headerStatus || itemStatus){
        newTodoDiv.classList.add('completed');
    }

    const todoText = document.createElement("li");
    todoText.classList.add("todo-text-"+itemIndex+'-'+headerIndex);
    todoText.innerText = todoTextValue;

    const editButton = document.createElement("button");
    editButton.classList.add("todo-edit-btn-"+itemIndex+'-'+headerIndex);
    editButton.innerHTML = '<i class="fa fa-pencil"></i>';

    const completedButton = document.createElement("button");
    completedButton.classList.add("todo-complete-btn-"+itemIndex+'-'+headerIndex);
    completedButton.innerHTML = '<i class="fa fa-check"></i>';

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("todo-delete-btn-"+itemIndex+'-'+headerIndex);
    deleteButton.innerHTML = '<i class="fa fa-trash"></i>';

    newTodoDiv.appendChild(todoText);    
    newTodoDiv.appendChild(editButton);
    newTodoDiv.appendChild(completedButton);
    newTodoDiv.appendChild(deleteButton);

    document.querySelector('.todo-list-items-'+headerIndex).appendChild(newTodoDiv);
}

//Save todo task under todo header in local storage
function saveTodoLocalStoage(headerIndex, todoValue){
    let todos = fetchLocalStorage();
    let todoListLength = 0;
    let headerStatus = false;
    todos.forEach(function(todo){
        if(todo["index"] == headerIndex){
            todo["todoList"].push({todoText: todoValue, todoIndex: todo["todoList"].length + 1, status: false});
            todoListLength = todo["todoList"].length;
            headerStatus = todo['status'];
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
    return [todoListLength, headerStatus];
}

// Edit todo task under todo header in local storage
function editTodoLocalStorage(headerIndex, todoIndex, newValue){
    let todos = fetchLocalStorage();
    todos.forEach(function(todo){
        if(todo["index"] == headerIndex){
            todo["todoList"].forEach(function(todoItem){
                if(todoItem["todoIndex"] == todoIndex){
                    todoItem["todoText"] = newValue;
                }
            })
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

//Toggling complete of todo item under todo header in local storage
function toggleCompleteLocalStorage(headerIndex, todoIndex){
    console.log(headerIndex, todoIndex);
    let todos = fetchLocalStorage();
    todos.forEach(function(todo){
        if(todo["index"] == headerIndex){
            todo["todoList"].forEach(function(todoItem){
                if(todoItem["todoIndex"] == todoIndex){
                    todoItem["status"] = !todoItem["status"];
                }
            })
        }
    })
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Delete todo task under todo header in local storage
function deleteTodoLocalStorage(headerIndex, todoIndex){
    let todos = fetchLocalStorage();
    todos.forEach(function(todo, index){
        if(todo["index"] == headerIndex){
            todo["todoList"].forEach(function(todoItem, index){
                if(todoItem["todoIndex"] == todoIndex){
                    todo["todoList"].splice(index, 1);
                }
            })
        }
    })
    localStorage.setItem('todos', JSON.stringify(todos));
}

//fetches data from local storage
function fetchLocalStorage(){
    let todos;
    if(localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

//Handling button clicks
function deleteCheckHeaderOrItem(e){
    console.log(e.target);
    element = e.target;
    if(element.classList[0].startsWith('edit-btn')){
        console.log("edting");
        const headerIndex = element.classList[0].replace('edit-btn-','');
        const headerText = document.querySelector('.todo-header-'+headerIndex);
        headerText.contentEditable = "true";
        headerText.style.border = "thin solid #5fbcf5";
        element.innerHTML = '<i class="fa fa-floppy-o"></i>';

        element.classList.remove("edit-btn-"+headerIndex);
        element.classList.add("save-btn-"+headerIndex);
    }
    else if(element.classList[0].startsWith("save-btn")){
        const headerIndex = element.classList[0].replace('save-btn-','');
        const headerText = document.querySelector('.todo-header-'+headerIndex);
        const newValue = headerText.innerText;
        headerText.contentEditable = "false";
        headerText.style.border = "none";
        element.innerHTML = '<i class="fa fa-pencil"></i>';

        editTodoHeadLocalStorage(newValue, headerIndex);
        element.classList.add("edit-btn-"+headerIndex);
        element.classList.remove("save-btn-"+headerIndex);
    }
    else if(element.classList[0].startsWith('complete-btn')){
        const headerIndex = element.classList[0].replace('complete-btn-','');
        toggleCompleteHeaderLocalStorage(headerIndex);

        todoCard = document.querySelector('.todo-card-'+headerIndex);
        todoCard.classList.toggle("completed");
    }
    else if(element.classList[0].startsWith('delete-btn')){
        const headerIndex = element.classList[0].replace('delete-btn-','');
        deleteTodoHeaderLocalStorage(headerIndex);

        todoCard = document.querySelector('.todo-card-'+headerIndex);
        todoCard.remove();
    }
    else if(element.classList[0].startsWith('todo-edit-btn')){
        const elementIndexes = element.classList[0].replace('todo-edit-btn-','');
        const todoIndex =  elementIndexes.substr(0,elementIndexes.indexOf('-'));
        const headerIndex = elementIndexes.substr(elementIndexes.indexOf('-')+1);
        const todoText = document.querySelector('.todo-text-'+elementIndexes);

        todoText.contentEditable = "true";
        todoText.style.border = "thin solid #5fbcf5";
        element.innerHTML = '<i class="fa fa-floppy-o"></i>';

        element.classList.remove("todo-edit-btn-"+todoIndex+'-'+headerIndex);
        element.classList.add("todo-save-btn-"+todoIndex+'-'+headerIndex);
    }
    else if(element.classList[0].startsWith('todo-save-btn')){
        const elementIndexes = element.classList[0].replace('todo-save-btn-','');
        const todoIndex =  elementIndexes.substr(0,elementIndexes.indexOf('-'));
        const headerIndex = elementIndexes.substr(elementIndexes.indexOf('-')+1);
        const todoText = document.querySelector('.todo-text-'+elementIndexes)
        const newValue = todoText.innerText;

        todoText.contentEditable = "false";
        todoText.style.border = "none";
        element.innerHTML = '<i class="fa fa-pencil"></i>';

        editTodoLocalStorage(headerIndex, todoIndex, newValue);

        element.classList.add("todo-edit-btn-"+todoIndex+'-'+headerIndex);
        element.classList.remove("todo-save-btn-"+todoIndex+'-'+headerIndex);
    }
    else if(element.classList[0].startsWith('todo-complete-btn')){
        const elementIndexes = element.classList[0].replace('todo-complete-btn-','');
        const todoIndex =  elementIndexes.substr(0,elementIndexes.indexOf('-'));
        const headerIndex = elementIndexes.substr(elementIndexes.indexOf('-')+1);
        toggleCompleteLocalStorage(headerIndex, todoIndex);

        todoDiv = document.querySelector('.todo-div-'+elementIndexes);
        todoDiv.classList.toggle("completed");
    }
    else if(element.classList[0].startsWith('todo-delete-btn')){
        const elementIndexes = element.classList[0].replace('todo-delete-btn-','');
        const todoIndex =  elementIndexes.substr(0,elementIndexes.indexOf('-'));
        const headerIndex = elementIndexes.substr(elementIndexes.indexOf('-')+1);
        deleteTodoLocalStorage(headerIndex, todoIndex);

        todoDiv = document.querySelector('.todo-div-'+elementIndexes);
        todoDiv.remove();
    }
}

//Rendering list on page load
function renderList(){
    todos = fetchLocalStorage();
    todos.forEach(function(todo){
        createListDOM(todo['index'], todo['header'], todo['status']);
        todo['todoList'].forEach(function(todoItem){
            createTodoItem(todoItem['todoText'], todo['index'] ,todoItem['todoIndex'], todo['status'], todoItem['status']);
        })
    })
}