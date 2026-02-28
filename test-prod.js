const https = require('https');

function makeRequest(path, method = 'GET', data = null, label = '') {
    const options = {
        hostname: 'task-manager-mern-assessment.vercel.app',
        port: 443,
        path: `/api${path}`,
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const req = https.request(options, (res) => {
        console.log(`\n[${label}] ${method} ${path} - STATUS: ${res.statusCode}`);
        let body = '';

        res.on('data', (d) => {
            body += d;
        });

        res.on('end', () => {
            console.log(`[${label}] BODY: ${body.substring(0, 300)}`);
        });
    });

    req.on('error', (e) => {
        console.error(`[${label}] PROBLEM: ${e.message}`);
    });

    if (data) {
        req.write(JSON.stringify(data));
    }

    req.end();
}

console.log('Starting tests...');

console.log('Testing POST /tasks...');
makeRequest('/tasks', 'POST', { title: 'Test Task from Script' }, 'POST');
