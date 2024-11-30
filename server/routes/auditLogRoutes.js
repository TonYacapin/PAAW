const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog.model');

// Get all Audit Logs
router.get('/audit-logs', async (req, res) => {
    try {
        const auditLogs = await AuditLog.find();
        res.json(auditLogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;