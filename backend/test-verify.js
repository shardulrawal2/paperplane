const http = require('http');

function testVerification(scenario, body) {
    const data = JSON.stringify(body);

    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/verify-certificate',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log(`\nTesting Scenario: ${scenario}`);

    const req = http.request(options, (res) => {
        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { responseBody += chunk; });
        res.on('end', () => {
            console.log(`Response: ${responseBody}`);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem: ${e.message}`);
    });

    req.write(data);
    req.end();
}

// Need a valid certificate first. 
// We will issue one, then use it for testing.

const issueData = JSON.stringify({
    skillName: "Node.js Expert",
    ownerId: "USER_VERIFY_TEST",
    issuer: "Test Institute"
});

const issueOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/issue-certificate',
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': issueData.length }
};

console.log("Setting up: Issuing a valid certificate...");
const issueReq = http.request(issueOptions, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        const response = JSON.parse(body);
        const validCert = response.certificate;
        const validOwner = validCert.ownerId;

        // 1. Valid Case
        testVerification("VALID Certificate", {
            certificate: validCert,
            claimedOwnerId: validOwner
        });

        // 2. Tampered Case (Modified Skill)
        const tamperedCert = { ...validCert, skillName: "Hacked Skill" };
        testVerification("TAMPERED Certificate", {
            certificate: tamperedCert,
            claimedOwnerId: validOwner
        });

        // 3. Ownership Mismatch Case
        testVerification("OWNERSHIP MISMATCH", {
            certificate: validCert,
            claimedOwnerId: "IMPOSTOR_USER"
        });

        // 4. Not Found Case
        const fakeCert = { ...validCert, certificateId: "00000000-0000-0000-0000-000000000000" };
        testVerification("NOT FOUND", {
            certificate: fakeCert,
            claimedOwnerId: validOwner
        });
    });
});

issueReq.write(issueData);
issueReq.end();
