
const fs = require("fs");
const path = require("path");

let html = null;
module.exports = {
    execute(data, response){
        if(!html){
            html = fs.readFileSync(path.join(__dirname, './test.html'), 'utf8');
        }

        response({
            html,
            status: 200
        });
    }
}