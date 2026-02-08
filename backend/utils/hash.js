const crypto = require('crypto');

/**
 * Returns a SHA-256 hash of the input.
 * @param {string|Buffer} input - The data to hash.
 * @returns {string} - The SHA-256 hash in hexadecimal format.
 */
function hashData(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

// Alias for backward compatibility if needed, but we'll try to update usages
const hashString = hashData;

module.exports = { hashData, hashString };
