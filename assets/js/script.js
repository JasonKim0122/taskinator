var taskIdCounter = 0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var pageContentEl = document.querySelector("#page-content");
var tasksInProgress = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function (event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false; 
    }
    var isEdit = formEl.hasAttribute("data-task-id");
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completedEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput
        };
        createTaskEl(taskDataObj);
    }
};


var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement ("li");
    listItemEl.className= "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className= "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    console.log(taskActionsEl);
    listItemEl.appendChild(taskActionsEl);

    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className= "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className ="btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent="Delete"
    deleteButtonEl.className= "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl= document.createElement("select");
    statusSelectEl.className ="select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId); 

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = [ "To Do", "In Progress", "Completed"];
    for (var i=0; i < statusChoices.length;  i++) {
        //create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var completedEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
      console.log ("edit", targetEl);
      var taskId = targetEl.getAttribute("data-task-id");
      editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
      console.log("delete", targetEl);
      var taskId= targetEl.getAttribute("data-task-id");
      deleteTask(taskId);
  }
};
var editTask = function(taskId) {
    //get task list element
    var taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");

    //get content from task name and type   
    var taskName = taskSelected.querySelector("h3.task-name").textContent; 
    console.log(taskName);
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType; 

    formEl.setAttribute("data-task-id", taskId);
    formEl.querySelector("#save-task").textContent = "Save Task";

    
};
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove ();
};

var taskStatusChangeHandler = function(event) {
    //get the task items id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase ();

    //find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgress.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }
};


pageContentEl.addEventListener("click", taskButtonHandler); 
formEl.addEventListener("submit",taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);