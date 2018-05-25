let createId = (namespace) => `${namespace}-${Date.now()}-${Math.round(Math.random() * 100)}`
let createListTemplate = (text, id) =>
    `
<div class="list" data-listId="${id}">
    <div class="listHeader">
    <h4>${text}
        <button>X</button>
    </h4>
        
    </div>
    <div class="addTask">
        <input type="text">
        <button>add task</button>
    </div>
</div>
`
let createTaskItemTemplate = (text, id) =>
    `
<div class="taskItem" data-taskId="${id}">
    <button>X</button>
    <div class="taskText">
        ${text}
    </div>
</div>
`
let addTask = function (evento) {
    let node = $(evento.target).parent()
    let listNode = node.parent();
    let input = node[0].children[0]; // vanilla Js
    let taskText = input.value.trim(); // vanilla Js
    // si no hay nombre no hagas nada
    if (taskText === '') {
        console.error('no valid task name');
        return;
    }
    let newTask = {
        "taskId": createId('task'),
        "text": taskText,
        "completed": false,
        "color": "tomato"

    }


    let listId = listNode[0].dataset.listid
    // save task to the backend before injecting a new node
    saveTask(newTask, listId)
        .then((response) => {
            // if the backend succeeds 

            // crear un node html
            let newTaskNode = $(createTaskItemTemplate(taskText, newTask.taskId));

            // inyectar el node creado
            listNode.append(newTaskNode);
            // borrar el value;
            input.value = ''; // vanilla Js
        })
        .catch((e) => {
            // if the backend failed
            console.error('no se pudo guardar la tarea, inténtelo de nuevo:', e)
        })
};

let deleteTask = function (taskId, listId) {
    return axios.delete(`http://127.0.0.1:3000/api/list/${listId}/${taskId}`)
}

let removeTask = function () {
    let node = $(this).parent();
    let listNode = node.parent();
    let taskId = $(this).parent().data("taskid");
    //console.log('taskid', taskId);

    let input = node[0].children[0]; //
    let taskText = input.value.trim();
    // borra el nodo desde el que se haya llamado



    //borrar tarea en el json EQUIPO1
    let listId = listNode[0].dataset.listid
    deleteTask(taskId, listId)
        .then((response) => {
            node.remove();
        }).catch((e) => {
            console.error('no se pudo borrar la tarea, inténtelo de nuevo:', e)
        })

};

//save  new  list:  POST  /api/list/:listID

let saveList = function (list) {
    // post new task the backend
    return axios.post(`http://127.0.0.1:3000/api/list/`, list)
}
let paintList = (listName, listId) => {
    // crear el nodo
    let newList = $(createListTemplate(listName, listId));

    // inyectarlo
    $('.lists').append(newList);
    return newList
}

let addList = (evento) => {
   
    // recoger el nombre de la lista
    let listName = $('.addList input').val().trim();

    // si no hay nombre no hagas nada
    if (listName === '') {
        console.error('no valid list name')
        return;
    }

    let newList = {
        "listId": createId('list'),
        "name": listName,
        "tasks": []
    }

    let listId = newList.listId;

    saveList(newList)
        .then((response) => {
            // borrar el input
            $('.addList input').val('')
            paintList(listName, listId);
        })
        .catch((e) => {
            console.error('no se pudo añadir la lista, inténtelo de nuevo:', e)
        })
};


let deleteList = function (listId) {
    // post new task the backend
    return axios.delete(`http://127.0.0.1:3000/api/list/${listId}`)
}

let removeList = function (event) {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent().parent().parent();
    let listId = $(this).parent().parent().parent().data("listid");

  
    deleteList(listId)
    .then((response) => {
        node.remove();
    }).catch((e) => {
        console.error('no se pudo borrar la lista, inténtelo de nuevo:', e)
    })
};


let paintTasks = (listNode, tasks) => {
    for (const task of tasks) {
        // crear un node html
        let newTaskNode = $(createTaskItemTemplate(task.text, task.taskId));

        // inyectar el node creado
        listNode.append(newTaskNode);
    }
}
let paintListsOnStart = (response) => {
    let lists = response.data.lists;
    for (const list of lists) {
        let listNode = paintList( list.name, list.listId);
        paintTasks(listNode, list.tasks);
    }
}

let saveTask = function (task, listId) {
    // post new task the backend
    return axios.post(`http://127.0.0.1:3000/api/list/${listId}/${task.taskId}`, task)
}



let callbackOnReady = () => {
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    // fetch saved lists from the backend
    axios.get('http://127.0.0.1:3000/api/list', config).then(paintListsOnStart).catch(console.error)



    $('.addList button').on('click', addList);
    $('.lists').on('click', '.listHeader button', removeList);
    $('.lists').on('click', '.addTask button', addTask);
    $('.lists').on('click', '.taskItem button', removeTask);
}
$(document).ready(callbackOnReady);