# simplified-concurrence

```javascript

const { Concurrent } = require('simplified-concurrence');
const type = 'thread';
const filename = path.join(__dirname, './job.js');
const keepAlive = true; //(auto restart if exits)

const concurrent = new Concurrent(type, filename, keepAlive);

const format = 'parallel';
console.time(`${type}: ${format}`);
//parallel
if(format === 'parallel'){
    await Promise.all(new Array(qty).fill().map(() => sendTest(concurrent)));
}else{
    //sync
    for(let i = 0; i < qty; i++){
        await sendTest(concurrent);
    }
}
console.timeEnd(`${type}: ${format}`);
await concurrent.terminate(); 

```
