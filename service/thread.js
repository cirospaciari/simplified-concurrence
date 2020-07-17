
const { Worker } = require("worker_threads");
const path = require("path");
const encoder = new TextEncoder();

class Thread {

    constructor(filename, keepAlive, encoded) {
        this.callbacks = {};
        this.encoded = encoded || false;
        this.filename = filename;
        this.keepAlive = keepAlive;
        
        this.start();
    }

    start() {
        this.running = true;
        this.worker = new Worker(path.join(__dirname, './thread_process.js'), {
            workerData: { encoded: this.encoded, filename: this.filename }
        });

        let last_error = null;

        this.worker.on('message', (data) => {
            if (this.encoded) {
                data = JSON.parse(new Buffer.from(data).toString('utf8'));
            }

            const callbacks = this.callbacks['message'] || [];

            callbacks.forEach((callback) => callback(data));
        });


        this.worker.on('error', (error) => {
            if (error) {
                last_error = error;
            }
        });

        this.worker.on('exit', (exitCode) => {
            this.running = false;

            //restart
            if (this.keepAlive) {
                this.start();
            }

            const callbacks = this.callbacks['exit'] || [];
            callbacks.forEach((callback) => callback(exitCode, last_error));
        });
    }

    

    send(data) {
        if (this.encoded) {
            data = encoder.encode(JSON.stringify(data));
            return this.worker.postMessage(data.buffer, [data.buffer]);
        }

        this.worker.postMessage(data);
    }

    message(callback) {
        if (typeof callback !== 'function')
            return false;

        this.callbacks['message'] = this.callbacks['message'] || [];
        this.callbacks['message'].push(callback);
        return true;
    }

    exit(callback) {
        if (typeof callback !== 'function')
            return false;

        this.callbacks['exit'] = this.callbacks['exit'] || [];
        this.callbacks['exit'].push(callback);
        return true;
    }

    terminate(){
        this.keepAlive = false;
        this.send({ kill: true });
    }

    isRunning(){
        return this.running;
    }
}

module.exports = Thread;