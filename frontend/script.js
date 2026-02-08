const API_URL = 'http://localhost:3000';

// DOM Elements
const issueForm = document.getElementById('issueForm');
const issuePdfForm = document.getElementById('issuePdfForm');
const verifyForm = document.getElementById('verifyForm');
const verifyPdfForm = document.getElementById('verifyPdfForm');
const certificateOutput = document.getElementById('certificateOutput');
const verifyJson = document.getElementById('verifyJson');
const copyBtn = document.getElementById('copyBtn');
const verificationResult = document.getElementById('verificationResult');
const resultStatus = document.getElementById('resultStatus');
const resultMessage = document.getElementById('resultMessage');

// Event Listeners
issueForm.addEventListener('submit', handleIssue);
issuePdfForm.addEventListener('submit', handleIssuePdf);
verifyForm.addEventListener('submit', handleVerify);
verifyPdfForm.addEventListener('submit', handleVerifyPdf);
copyBtn.addEventListener('click', copyCertificate);

// Tab Switching
window.showTab = function (tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    if (tabName === 'json') {
        document.getElementById('verifyForm').style.display = 'block';
        document.querySelector('.tab-btn:nth-child(1)').classList.add('active');
    } else {
        document.getElementById('verifyPdfForm').style.display = 'block';
        document.querySelector('.tab-btn:nth-child(2)').classList.add('active');
    }
    verificationResult.classList.add('hidden'); // Hide result when switching tabs
};

// Handle Issue Certificate (JSON)
async function handleIssue(e) {
    e.preventDefault();
    const skillName = document.getElementById('skillName').value;
    const ownerId = document.getElementById('ownerId').value;
    const issuer = document.getElementById('issuer').value;

    try {
        const response = await fetch(`${API_URL}/issue-certificate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillName, ownerId, issuer })
        });

        const data = await response.json();

        if (response.ok) {
            const certString = JSON.stringify(data.certificate, null, 2);
            certificateOutput.value = certString;
            verifyJson.value = certString;
            document.getElementById('verifyOwnerId').value = ownerId;
            alert('Certificate Issued!');
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Network error.');
    }
}

// Handle Issue PDF Certificate
async function handleIssuePdf(e) {
    e.preventDefault();
    const fileInput = document.getElementById('pdfFile');
    const ownerId = document.getElementById('pdfOwnerId').value;
    const issuer = document.getElementById('pdfIssuer').value;

    if (!fileInput.files[0]) {
        alert('Please select a PDF file.');
        return;
    }

    const formData = new FormData();
    formData.append('certificate', fileInput.files[0]);
    formData.append('ownerId', ownerId);
    formData.append('issuer', issuer);

    try {
        const response = await fetch(`${API_URL}/issue-pdf-certificate`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            certificateOutput.value = JSON.stringify(data, null, 2);
            // Pre-fill verify form
            document.getElementById('verifyPdfCertId').value = data.certificateId;
            document.getElementById('verifyPdfOwnerId').value = ownerId;
            alert('PDF Certificate Issued! ID copied to wallet.');
        } else {
            alert('Error: ' + (data.error || data.message));
        }
    } catch (err) {
        console.error(err);
        alert('Network error.');
    }
}

// Handle Verify Certificate (JSON)
async function handleVerify(e) {
    e.preventDefault();
    const jsonInput = verifyJson.value;
    const claimedOwnerId = document.getElementById('verifyOwnerId').value;

    let certificate;
    try {
        certificate = JSON.parse(jsonInput);
    } catch (err) {
        alert('Invalid JSON format');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/verify-certificate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ certificate, claimedOwnerId })
        });

        const data = await response.json();
        displayResult(data.status, data.message);

    } catch (err) {
        console.error(err);
        alert('Verification failed.');
    }
}

// Handle Verify PDF Certificate
async function handleVerifyPdf(e) {
    e.preventDefault();
    const fileInput = document.getElementById('verifyPdfFile');
    const certificateId = document.getElementById('verifyPdfCertId').value;
    const claimedOwnerId = document.getElementById('verifyPdfOwnerId').value;

    if (!fileInput.files[0]) {
        alert('Please select a PDF file to verify.');
        return;
    }

    const formData = new FormData();
    formData.append('certificate', fileInput.files[0]);
    formData.append('certificateId', certificateId);
    formData.append('claimedOwnerId', claimedOwnerId);

    try {
        const response = await fetch(`${API_URL}/verify-pdf-certificate`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        displayResult(data.status, data.message);

    } catch (err) {
        console.error(err);
        alert('Verification failed.');
    }
}

// Display Result using CSS classes
function displayResult(status, message) {
    verificationResult.classList.remove('hidden');
    // Reset classes
    verificationResult.className = 'result-box';
    // Add specific status class
    verificationResult.classList.add(`status-${status}`);

    resultStatus.textContent = status;
    resultMessage.textContent = message;
}

// Copy to Clipboard helper
function copyCertificate() {
    certificateOutput.select();
    document.execCommand('copy');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => copyBtn.textContent = originalText, 2000);
}
