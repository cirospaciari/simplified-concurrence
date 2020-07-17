const { workerData, parentPort } = require("worker_threads");
const encoder = new TextEncoder();
const { filename, encoded } = workerData;


const job = require(filename);

let request_counter = 0;
let kill_after_ends = false;
let closed = false;

parentPort.on('message', (request)=>{
    if(encoded){
        request = JSON.parse(new Buffer.from(request).toString('utf8'));
    }

    if(request.kill){
        closed = true;
        return parentPort.close();
    }

    request_counter++;

    job.execute(request.data, (result)=> {
        if(encoded){
            result = encoder.encode(JSON.stringify(result));
            return parentPort.postMessage(result.buffer, [result.buffer]);
         }

         parentPort.postMessage( { id: request.id, data: result });

         request_counter--;

         setImmediate(() => {
             if (kill_after_ends && request_counter === 0 && !closed) {
                closed = true; 
                parentPort.close();
             }
         });
    });
});