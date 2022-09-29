const { workerData, parentPort } = require("worker_threads");
const encoder = new TextEncoder();
const { filename, encoded } = workerData;


const job = require(filename);

let request_counter = 0;
let closed = false;

parentPort.on('message', (request)=>{
    if(encoded){
        request = JSON.parse(new Buffer.from(request).toString('utf8'));
    }

    if(request.kill){
        closed = true;
        return parentPort.close();
    }

    job.execute(request.data, (result)=> {
        if(encoded){
            result = encoder.encode(JSON.stringify(result));
            return parentPort.postMessage(result.buffer, [result.buffer]);
         }

         parentPort.postMessage( { id: request.id, data: result });
    });
});