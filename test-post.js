const https = require('https');
const fs = require('fs');

const data = JSON.stringify({ title: 'Test Task from Script' });

const options = {
    hostname: 'task-manager-mern-assessment.vercel.app',
    port: 443,
    path: '/api/tasks',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
    },
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        const output = `STATUS: ${res.statusCode}\nHEADERS: ${JSON.stringify(res.headers, null, 2)}\nBODY: ${body}\n`;
        fs.writeFileSync('test-output.txt', output);
        console.log('Output written to test-output.txt');
    });
});

req.on('error', (e) => {
    fs.writeFileSync('test-output.txt', `ERROR: ${e.message}\n`);
    console.log('Error written to test-output.txt');
});

req.write(data);
req.end();
