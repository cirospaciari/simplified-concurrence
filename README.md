[![npm package](https://nodei.co/npm/simplified-concurrence.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/simplified-concurrence/)

[![NPM version](https://img.shields.io/npm/v/simplified-concurrence.svg)](https://img.shields.io/npm/v/simplified-concurrence.svg)
[![NPM License](https://img.shields.io/npm/l/simplified-concurrence.svg)](https://img.shields.io/npm/l/simplified-concurrence.svg)
[![NPM Downloads](https://img.shields.io/npm/dm/simplified-concurrence.svg?maxAge=43200)](https://img.shields.io/npm/dm/simplified-concurrence.svg?maxAge=43200)

Support me for future versions:

[![BMC](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/i2yBGw7)

[![PAGSEGURO](https://stc.pagseguro.uol.com.br/public/img/botoes/doacoes/209x48-doar-assina.gif)](https://pag.ae/7VxyJphKt)

# simplified-concurrence

```javascript

const { Concurrent } = require('simplified-concurrence');
const type = 'thread'; //thread/fork
const filename = path.join(__dirname, './job.js'); //task  { execute(data, resolve) }
const keepAlive = true; //(auto restart if exits)

const concurrent = new Concurrent(type, filename, keepAlive);

const format = 'parallel';
console.time(`${type}: ${format}`);
//parallel
if(format === 'parallel'){
    await Promise.all(new Array(qty).fill().map(() => concurrent.send({
        url: '/',
        search: '',
        host: 'www.mysite.com',
        hostname: 'www.mysite.com',
        protocol: 'https:',
        origin: 'https://www.mysite.com',
        cookies: {
            '1P_JAR': '2020-07-17-14',
            'sessionId': 'qIrbBOn5ozPKkoSNGQWc2aeBw4Jh36lX.kChB3EVDtlbAacQTYnH2k4aj5oDDq%2FJTUqvHPWChNvM',
            '_gid': 'GA1.2.123123.123123',
            '_ga': 'GA1.2.123123.123123',
            '__cfduid': 'd4629efedb3bf194c9b66f1473e2baf021594918717',
            'analytic_id': '1594918720943223',
            '_hjid': 'e0a41a76-c677-4798-80ad-5c64ce891511'
        },
        params: {}
    })));
}else{
    //sync
    for(let i = 0; i < qty; i++){
        await concurrent.send({
            url: '/',
            search: '',
            host: 'www.mysite.com',
            hostname: 'www.mysite.com',
            protocol: 'https:',
            origin: 'https://www.mysite.com',
            cookies: {
                '1P_JAR': '2020-07-17-14',
                'sessionId': 'qIrbBOn5ozPKkoSNGQWc2aeBw4Jh36lX.kChB3EVDtlbAacQTYnH2k4aj5oDDq%2FJTUqvHPWChNvM',
                '_gid': 'GA1.2.123123.123123',
                '_ga': 'GA1.2.123123.123123',
                '__cfduid': 'd4629efedb3bf194c9b66f1473e2baf021594918717',
                'analytic_id': '1594918720943223',
                '_hjid': 'e0a41a76-c677-4798-80ad-5c64ce891511'
            },
            params: {}
        });
    }
}
console.timeEnd(`${type}: ${format}`);
await concurrent.terminate(); 
```
