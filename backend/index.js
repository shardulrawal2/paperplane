const express = require('express');
const fs = require('fs');
const path = require('path');
const { hashData } = require('./utils/hash');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON request parsing
app.use(express.json());

// Enable CORS manually for hackathon simplicity
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Load the registry file from disk
const REGISTRY_PATH = path.join(__dirname, 'registry.json');
let registry = [];

try {
    const data = fs.readFileSync(REGISTRY_PATH, 'utf8');
    registry = JSON.parse(data);
    console.log(`Loaded ${registry.length} certificates from registry.`);
} catch (err) {
    console.error('Error loading registry:', err.message);
    // Prepare an empty registry if file doesn't exist or is invalid
    registry = [];
}

// GET /health
app.get('/health', (req, res) => {
    res.json({ status: "Backend running" });
});

// Certificate Issuance Endpoint
app.post('/issue-certificate', (req, res) => {
    const { skillName, ownerId, issuer } = req.body;

    // 1. Validate request body
    if (!skillName || !ownerId || !issuer) {
        return res.status(400).json({ error: 'Missing required fields: skillName, ownerId, issuer' });
    }

    // 2. Create certificate object
    const certificate = {
        certificateId: uuidv4(),
        skillName,
        issuer,
        ownerId,
        issuedAt: new Date().toISOString()
    };

    // 3. Hash certificate content
    // We stringify the certificate object to create a consistent input for hashing
    const certificateString = JSON.stringify(certificate);
    const hash = hashData(certificateString);

    // 4. Store metadata in registry
    const registryEntry = {
        certificateId: certificate.certificateId,
        hash,
        ownerId,
        issuer
    };

    registry.push(registryEntry);

    // 5. Persist to disk
    try {
        fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
        console.log(`Certificate issued: ${certificate.certificateId}`);
    } catch (err) {
        console.error('Error writing registry:', err);
        return res.status(500).json({ error: 'Failed to save certificate' });
    }

    // 6. Return response
    res.json({
        message: "Certificate issued successfully",
        certificate,
        hash
    });
});

// Certificate Verification Endpoint
app.post('/verify-certificate', (req, res) => {
    const { certificate, claimedOwnerId } = req.body;

    if (!certificate || !certificate.certificateId || !claimedOwnerId) {
        return res.status(400).json({ status: "ERROR", message: "Missing certificate or claimedOwnerId" });
    }

    // Step 1: Locate Registry Record
    const registryEntry = registry.find(entry => entry.certificateId === certificate.certificateId);

    if (!registryEntry) {
        return res.json({
            status: "NOT_FOUND",
            message: "Certificate not found in registry"
        });
    }

    // Step 2: Hash Integrity Check
    // Recompute SHA-256 hash of the provided certificate object
    const certificateString = JSON.stringify(certificate);
    const recomputedHash = hashData(certificateString);

    if (recomputedHash !== registryEntry.hash) {
        return res.json({
            status: "TAMPERED",
            message: "Certificate content has been modified"
        });
    }

    // Step 3: Ownership Check (Soulbound Rule)
    if (registryEntry.ownerId !== claimedOwnerId) {
        return res.json({
            status: "OWNERSHIP_MISMATCH",
            message: "Certificate does not belong to the claimed owner"
        });
    }

    // Step 4: Success Case
    res.json({
        status: "VALID",
        message: "Certificate is authentic and belongs to the claimed owner"
    });
});

// PDF Certificate Issuance Endpoint
app.post('/issue-pdf-certificate', upload.single('certificate'), (req, res) => {
    const { ownerId, issuer } = req.body;
    const file = req.file;

    if (!file || !ownerId || !issuer) {
        return res.status(400).json({ error: 'Missing required fields: certificate (file), ownerId, issuer' });
    }

    // 1. Generate certificateId
    const certificateId = uuidv4();

    // 2. Hash file buffer
    const hash = hashData(file.buffer);

    // 3. Store metadata in registry
    const registryEntry = {
        certificateId,
        hash,
        ownerId,
        issuer,
        type: 'PDF', // Optional: flag to distinguish types
        issuedAt: new Date().toISOString()
    };

    registry.push(registryEntry);

    // 4. Persist to disk
    try {
        fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
        console.log(`PDF Certificate issued: ${certificateId}`);
    } catch (err) {
        console.error('Error writing registry:', err);
        return res.status(500).json({ error: 'Failed to save certificate' });
    }

    // 5. Return response
    res.json({
        message: "PDF certificate issued",
        certificateId,
        hash
    });
});

// PDF Certificate Verification Endpoint
app.post('/verify-pdf-certificate', upload.single('certificate'), (req, res) => {
    const { certificateId, claimedOwnerId } = req.body;
    const file = req.file;

    if (!file || !certificateId || !claimedOwnerId) {
        return res.status(400).json({ status: "ERROR", message: "Missing required fields" });
    }

    // Step 1: Locate Registry Record
    const registryEntry = registry.find(entry => entry.certificateId === certificateId);

    if (!registryEntry) {
        return res.json({
            status: "NOT_FOUND",
            message: "Certificate not found in registry"
        });
    }

    // Step 2: Hash Integrity Check
    const recomputedHash = hashData(file.buffer);

    if (recomputedHash !== registryEntry.hash) {
        return res.json({
            status: "TAMPERED",
            message: "Certificate content has been modified"
        });
    }

    // Step 3: Ownership Check
    if (registryEntry.ownerId !== claimedOwnerId) {
        return res.json({
            status: "OWNERSHIP_MISMATCH",
            message: "Certificate does not belong to the claimed owner"
        });
    }

    // Step 4: Success Case
    res.json({
        status: "VALID",
        message: "PDF Certificate is authentic and belongs to the claimed owner"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
