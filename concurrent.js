const path = require("path");

const crypto = require('crypto');
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function old_uuid(){
    const rnds = crypto.randomFillSync(new Uint8Array(16));
    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;
    return (
      byteToHex[rnds[0]] +
      byteToHex[rnds[1]] +
      byteToHex[rnds[2]] +
      byteToHex[rnds[3]] +
      '-' +
      byteToHex[rnds[4]] +
      byteToHex[rnds[5]] +
      '-' +
      byteToHex[rnds[6]] +
      byteToHex[rnds[7]] +
      '-' +
      byteToHex[rnds[8]] +
      byteToHex[rnds[9]] +
      '-' +
      byteToHex[rnds[10]] +
      byteToHex[rnds[11]] +
      byteToHex[rnds[12]] +
      byteToHex[rnds[13]] +
      byteToHex[rnds[14]] +
      byteToHex[rnds[15]]
    ).toLowerCase();
}

let uuid = null;

const NODE_VERSION = parseFloat(process.version.match(/^v(\d+\.\d+)/)[1]);
if(NODE_VERSION < 16){
    uuid = old_uuid;
}else{
    uuid = crypto.randomUUID;
}
class Concurrent {
    constructor(type, filename, keepAlive, encoded){
        if(type === 'thread' && NODE_VERSION < 12){
            type = 'fork'; //fallback
            console.warn(`Node Version ${NODE_VERSION} do not support thread option, using fork as fallback, please use node v12+ for thread option support`);
        }
        

        if(type !== 'fork' && type !== 'thread'){
            throw new Error('Invalid type passed to Concurrent please use thread or fork');
        }
        
        const ConcurrentType = require(path.join(__dirname, './service', type + '.js'));

        this.worker = new ConcurrentType(filename, keepAlive, encoded);
        this.resolvers = new Map();
        this.worker.message((response)=> {
            if(this.resolvers.has(response.id)){
                this.resolvers.get(response.id).resolve(response.data);
                this.resolvers.delete(response.id);
            }
        });

        this.worker.exit((exitCode, error)=> {

            this.resolvers.forEach((promise)=> {
                promise.reject({ exitCode, error });
            });

            this.resolvers.clear();
        });
    }
    isRunning(){
        return this.worker.isRunning();
    }
    
    isRestarting(){
        return this.restarting;
    }


    waitExit(){
        return new Promise((resolve)=> {

            const check = ()=>{
                if(this.isRunning()){
                   return setImmediate(()=> check());
                }
                resolve();
            }
            
            check();
        });
    }


    send(data){
        return new Promise((resolve, reject)=> {
            const id = uuid();
            this.resolvers.set(id, { resolve, reject });
            this.worker.send({ id , data });
        });
    }

    terminate(dontWait){
        this.worker.terminate();
        if(!dontWait)
            return;
        return this.waitExit();
    }
    async restart(){
        this.restarting = true;
        const old_keepAlive = this.worker.keepAlive;
        await this.terminate();
        this.worker.keepAlive = old_keepAlive;
        this.worker.start();
        this.restarting = false;
    }
}

module.exports = Concurrent;