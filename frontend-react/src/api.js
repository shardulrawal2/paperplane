export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function issueCertificate(formData) {
    const response = await fetch(`${API_URL}/issue-pdf-certificate`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Failed to issue certificate');
    }
    return data;
}

export async function verifyCertificate(formData) {
    const response = await fetch(`${API_URL}/verify-pdf-certificate`, {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();
    // Note: verification endpoint returns 200 even for INVALID results, 
    // so we just return the data. Error handling is for network/500s.
    if (!response.ok) {
        throw new Error(data.message || data.error || 'Verification failed');
    }
    return data;
}
