let fs = require('fs');

let deleteTask = (req, res) => {
    let listId = req.params.listID;
    let taskId = req.params.taskID;

    //console.log('esto sale?')
    // Read file from fs
    fs.readFile('backend/board.json', 'utf-8', (e, file) => {
      
        let board = JSON.parse(file);
        // find listID
        let found = false;
        board.lists.forEach( (list,j) => {
            if (list.listId === listId) {
                list.tasks.forEach((task, i) => {
                    if(task.taskId === taskId) {
                        board.lists[j].tasks.splice(i,1);
                        found = true;
                    }
                })
            }
        })
        if(!found) {
            res.sendStatus(404)
            return;
        }
       // console.log(board.lists[0].tasks);
        
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
module.exports = deleteTask;
