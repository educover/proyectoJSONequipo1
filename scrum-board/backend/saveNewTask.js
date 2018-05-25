let fs = require('fs');

let saveTask = (req, res) => {
    let listId = req.params.listID;
    let task = req.body;

    // Read file from fs
    fs.readFile('backend/board.json', 'utf-8', (e, file) => {
        let found = false;
        let board = JSON.parse(file);
        // find listID
        for (let list of board.lists) {
            if (list.listId === listId) {
                console.log("pasa")
                // add new Task to the list found
                list.tasks.push(task);
                found = true;
                break;              
            }
        }
        // if listId not found reply with 404
        if (!found) {
            res.sendStatus(404);
            return;
        }
        // write the file back
        fs.writeFile('backend/board.json', JSON.stringify(board), (e) => {
            if(e) {
                // if any error saving the file respond with 500
                res.sendStatus(500);
                return
            }
            // if all ok respond with 200 (OK)
            res.sendStatus(200);
        })
        

    })
}
module.exports = saveTask;