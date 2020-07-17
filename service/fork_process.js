const filename = process.argv[2];

const job = require(filename);
let request_counter = 0;
let kill_after_ends = false;
process.on('message', (request) => {

    if (request.kill) {
        //mark to kill after ends
        kill_after_ends = true;
        setImmediate(() => {
            if (request_counter === 0 && process.connected) {
                process.disconnect();
            }
        });
        return;
    }
    request_counter++;

    job.execute(request.data, (result) => {
    
        process.send({ id: request.id, data: result }, null, {}, (error)=>{
            if (error !== null) console.error('SSR: Fail to send response', error);
            request_counter--;
            setImmediate(() => {
                if (kill_after_ends && request_counter === 0 && process.connected) {
                    process.disconnect();
                }
            });
        });   
    });
});