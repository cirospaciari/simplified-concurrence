const Concurrent = require('../concurrent');
const path = require("path");

async function sendTest(concurrent) {
    const result = await concurrent.send({
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
    return result.html.length;
}

async function execute(type, format, qty) {
    const concurrent = new Concurrent(type, path.join(__dirname, './job.js'));

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
}

async function executeAll(){
    await execute('fork', 'parallel', 1000);
    await execute('fork', 'sync', 1000);

    await execute('thread', 'parallel', 1000);
    await execute('thread', 'sync', 1000);
}
console.info(`Running ${1000} example requests:`);

executeAll(1000);