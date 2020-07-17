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
    await Promise.all(new Array(qty).fill().map(() => concurrent.send({
        url: '/',
        search: '',
        host: 'www.betsul.com',
        hostname: 'www.betsul.com',
        protocol: 'https:',
        origin: 'https://www.betsul.com',
        cookies: {
            '1P_JAR': '2020-07-17-14',
            'sessionId': 'qIrbBOn5ozPKkoSNGQWc2BeBw4Jh36lX.kChB3EVDtlbAacQTYnH2k4aj5oDDq%2FJTUqvHPWChNvM',
            '_gid': 'GA1.2.696250576.1594918720',
            '_ga': 'GA1.2.1859053201.1594918720',
            '__cfduid': 'd4629efedb3bf194c9b66f0473e2baf021594918717',
            'analytic_id': '1594918720943223',
            '_hjid': 'e0a41a76-c677-4798-80ad-5c64ce894511'
        },
        params: {}
    })));
}else{
    //sync
    for(let i = 0; i < qty; i++){
        await concurrent.send({
            url: '/',
            search: '',
            host: 'www.betsul.com',
            hostname: 'www.betsul.com',
            protocol: 'https:',
            origin: 'https://www.betsul.com',
            cookies: {
                '1P_JAR': '2020-07-17-14',
                'sessionId': 'qIrbBOn5ozPKkoSNGQWc2BeBw4Jh36lX.kChB3EVDtlbAacQTYnH2k4aj5oDDq%2FJTUqvHPWChNvM',
                '_gid': 'GA1.2.696250576.1594918720',
                '_ga': 'GA1.2.1859053201.1594918720',
                '__cfduid': 'd4629efedb3bf194c9b66f0473e2baf021594918717',
                'analytic_id': '1594918720943223',
                '_hjid': 'e0a41a76-c677-4798-80ad-5c64ce894511'
            },
            params: {}
        });
    }
}
console.timeEnd(`${type}: ${format}`);
await concurrent.terminate(); 
```
