let express = require('express');
let app = express();
var cors = require('cors');
let getAllBoard = require('./getAllBoard.js');
let saveNewTask = require('./saveNewTask.js');
let deleteOldTask = require('./deleteOldTask.js');
let deleteOldList = require('./deleteOldList.js');
let saveNewList = require('./saveNewList.js');
let bodyParser = require('body-parser')
// allow cross origin domain
app.use(cors());

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// setup endpoint for getting all the lists from the board 
app.get('/api/list', getAllBoard);

// Endpoint for saving new tasks
app.post('/api/list/:listID/:taskID', saveNewTask)

//  Endpoint for saving new lists
app.post('/api/list', saveNewList)

// DELETE  /api/list/:listID/:taskID Equipo1
app.delete('/api/list/:listID/:taskID', deleteOldTask)

// delete lists
app.delete('/api/list/:listID', deleteOldList)

// start server listening at port 3000
app.listen(3000, '127.0.0.1', () => {
    console.log('servidor levantado en el puerto 3000');
})