const AuditLog = require('../models/AuditLog.model'); // Adjust the path to your AuditLog model

// Function to create an audit log entry
const createAuditLog = async (action, collectionName, documentId, user, status, message = '') => {
    const auditLog = new AuditLog({
        action,
        collectionName,
        documentId,
        user,
        status,
        message,
    });

    await auditLog.save();
};

// Middleware for logging requests
const auditLogMiddleware = async (req, res, next) => {
    const userEmail = req.user?.email || 'Guest'; // Get user email if available
    const action = req.method; // Log the HTTP method (GET, POST, etc.)
    const collectionName = req.originalUrl; // Use original URL for collection name
    const documentId = req.user?.userId; // Use user ID if available

    // Create audit log entry for request
    await createAuditLog(action, collectionName, documentId, userEmail, 'request', `Requested ${req.originalUrl}`);

    // Capture response
    const oldSend = res.send.bind(res);
    res.send = async function (...args) {
        const status = res.statusCode;
        await createAuditLog(action, collectionName, documentId, userEmail, status >= 400 ? 'failure' : 'success', `Response: ${status}`);
        return oldSend(...args);
    };

    next();
};

module.exports = auditLogMiddleware;
