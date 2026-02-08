const fs = require('fs');
const http = require('http');
const path = require('path');

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

function runTest() {
    const filePath = path.resolve(__dirname, 'test-certificate.pdf');

    if (!fs.existsSync(filePath)) {
        console.error('Error: test-certificate.pdf not found at', filePath);
        return;
    }

    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    // Construct Multipart Body for Issuance
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="ownerId"\r\n\r\nPDF_USER\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="issuer"\r\n\r\nPDF_ISSUER\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="certificate"; filename="${fileName}"\r\n`;
    body += `Content-Type: application/pdf\r\n\r\n`;

    const bodyHeader = Buffer.from(body, 'utf-8');
    const bodyFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');

    const fullBody = Buffer.concat([bodyHeader, fileContent, bodyFooter]);

    const issueOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/issue-pdf-certificate',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': fullBody.length
        }
    };

    console.log('1. Issuing PDF Certificate...');

    const req = http.request(issueOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log('Issue Response:', data);
            try {
                const json = JSON.parse(data);
                if (json.certificateId) {
                    verifyPdf(json.certificateId, 'PDF_USER', 'VALID');
                    setTimeout(() => verifyPdf(json.certificateId, 'WRONG', 'OWNERSHIP_MISMATCH'), 1000);
                }
            } catch (e) {
                console.error('Failed to parse response');
            }
        });
    });

    req.write(fullBody);
    req.end();
}

function verifyPdf(certId, ownerId, expectedStatus) {
    const filePath = path.resolve(__dirname, 'test-certificate.pdf');
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="certificateId"\r\n\r\n${certId}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="claimedOwnerId"\r\n\r\n${ownerId}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="certificate"; filename="${fileName}"\r\n`;
    body += `Content-Type: application/pdf\r\n\r\n`;

    const bodyHeader = Buffer.from(body, 'utf-8');
    const bodyFooter = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
    const fullBody = Buffer.concat([bodyHeader, fileContent, bodyFooter]);

    const verifyOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/verify-pdf-certificate',
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': fullBody.length
        }
    };

    console.log(`\n2. Verifying PDF (Expected: ${expectedStatus})...`);

    const req = http.request(verifyOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`Verify Response (${ownerId}):`, data);
        });
    });

    req.write(fullBody);
    req.end();
}

runTest();
