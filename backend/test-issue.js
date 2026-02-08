const http = require('http');

const data = JSON.stringify({
    skillName: "React Basics",
    ownerId: "USER_123",
    issuer: "Demo Institute"
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/issue-certificate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
