const AuditLog = require('../models/AuditLog.model'); // Adjust the path to your AuditLog model

// Function to create a user-friendly audit log entry
const createAuditLog = async (action, resource, resourceId, user, outcome, description = '') => {
    const auditLog = new AuditLog({
        action,
        resource,
        resourceId,
        user,
        outcome,
        description,
    });

    await auditLog.save();
};

// Middleware for logging requests in a user-friendly way
const auditLogMiddleware = async (req, res, next) => {
    const userEmail = req.user?.email || 'Guest'; // Get user email if available
    const action = translateAction(req.method); // Convert HTTP method to a simpler action
    const resource = translateResource(req.originalUrl); // Make the URL more descriptive
    const resourceId = req.user?.userId || 'N/A'; // Use user ID if available, otherwise show 'N/A'

    // Create audit log entry for the request
    await createAuditLog(action, resource, resourceId, userEmail, 'in progress', `User requested ${resource}`);

    // Capture response
    const oldSend = res.send.bind(res);
    res.send = async function (...args) {
        const status = res.statusCode;
        const outcome = status >= 400 ? 'failed' : 'successful';
        const description = `The request was ${outcome} with status code ${status}`;
        await createAuditLog(action, resource, resourceId, userEmail, outcome, description);
        return oldSend(...args);
    };

    next();
};

// Function to translate HTTP methods into simpler actions
const translateAction = (method) => {
    switch (method) {
        case 'GET':
            return 'Viewed';
        case 'POST':
            return 'Added';
        case 'PUT':
        case 'PATCH':
            return 'Updated';
        case 'DELETE':
            return 'Removed';
        default:
            return 'Performed an action';
    }
};

const translateResource = (url) => {
    if (url.includes('/api/vetshipform')) return 'Veterinary Shipment Form';
    if (url.includes('/api/slaughterform')) return 'Slaughter Form';
    if (url.includes('/api/technician-quarterly')) return 'Technician Quarterly Report';
    if (url.includes('/api/offspring-monitoring')) return 'Offspring Monitoring';
    if (url.includes('/api/upgrading-services')) return 'Upgrading Services';
    if (url.includes('/api/mtargets')) return 'Municipality Targets';
    if (url.includes('/api/targets')) return 'Vaccination Targets';
    if (url.includes('/api/inventory')) return 'Inventory';
    if (url.includes('/api/audit-logs')) return 'Audit Logs';
    if (url.includes('/api/users')) return 'User Management';
    if (url.includes('/api/login')) return 'Authentication';
    if (url.includes('/RSM')) return 'Routine Services Monitoring Report';
    if (url.includes('/api/entries')) return 'Rabies Vaccination Report';
    if (url.includes('/disease-investigation')) return 'Disease Investigation';
    if (url.includes('/RH')) return 'Rabies History';
    if (url.includes('/species-count')) return 'Vaccination Accomplishment Report';
    if (url.includes('/rabies-vaccination-summary')) return 'Vaccination Accomplishment Report';
    if (url.includes('/rabies-report')) return 'Rabbies History Accomplishment Report';
    if (url.includes('/species-activity-count')) return 'Routine Services Monitoring Report';



    // Default case if none of the patterns match
    return url;
};

module.exports = auditLogMiddleware;
