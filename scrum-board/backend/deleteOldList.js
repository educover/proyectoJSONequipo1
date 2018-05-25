let fs = require('fs');

let deleteList = (req, res) => {
    let listId = req.params.listID;

    //console.log('esto sale?')
    // Read file from fs
    fs.readFile('backend/board.json', 'utf-8', (e, file) => {
      
        let board = JSON.parse(file);
        // find listID
        let found = false;
        board.lists.forEach( (list,i) => {
            if (list.listId === listId){
                board.lists.splice(i, 1);
                found = true;
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
module.exports = deleteList;
