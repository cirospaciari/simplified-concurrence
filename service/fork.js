
const path = require("path");
const encoder = new TextEncoder();
const { fork } = require('child_process');

class Fork {

    constructor(filename, keepAlive) {
        this.callbacks = {};
        this.filename = filename;
        this.keepAlive = keepAlive;
        this.start();
    }

    start() {
        this.worker = new fork(path.join(__dirname, './fork_process.js'), [this.filename]);

        let last_error = null;

        this.worker.on('message', (data) => {
            
            const callbacks = this.callbacks['message'] || [];

            callbacks.forEach((callback) => callback(data));
        });


        this.worker.on('error', (error) => {
            if (error) {
                last_error = error;
            }
        });

        this.worker.on('exit', (exitCode) => {
            //restart
            if (this.keepAlive) {
                this.start();
            }

            const callbacks = this.callbacks['exit'] || [];
            callbacks.forEach((callback) => callback(exitCode, last_error));
        });
    }



    send(data) {
        this.worker.send(data, null, {}, (error) => {
            if (error) {
                //restart
                if (this.keepAlive) {
                    this.start();
                }

                const callbacks = this.callbacks['exit'] || [];
                callbacks.forEach((callback) => callback(-1, error));
            }
        });
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

    terminate() {
        this.keepAlive = false;
        this.send({ kill: true });
    }

    isRunning(){
        return this.worker.exitCode !== null;
    }
}

module.exports = Fork;