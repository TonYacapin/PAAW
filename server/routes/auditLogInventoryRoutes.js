const express = require('express');
const AuditLogInventory = require('../models/auditLogInventoryModel'); // Updated model name
const router = express.Router();

// GET all audit logs
router.get('/', async (req, res) => {
  try {
    const auditLogs = await AuditLogInventory.find().populate('inventoryId'); // Populate inventory details if needed
    res.status(200).json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching audit logs' });
  }
});

// GET a single audit log by ID
router.get('/:id', async (req, res) => {
  try {
    const auditLog = await AuditLogInventory.findById(req.params.id).populate('inventoryId');
    if (!auditLog) {
      return res.status(404).json({ error: 'Audit log not found' });
    }
    res.status(200).json(auditLog);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching audit log' });
  }
});

// POST - Create a new audit log
router.post('/', async (req, res) => {
    console.log('this is inventory auditlog user: ' + JSON.stringify(req.body, null, 2));
  const { action, inventoryId, user, changes } = req.body;

  try {
    const auditLog = new AuditLogInventory({ action, inventoryId, user, changes });
    const savedLog = await auditLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(400).json({ error: 'Error creating audit log', details: error.message });
  }
});

// DELETE - Remove an audit log by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedLog = await AuditLogInventory.findByIdAndDelete(req.params.id);
    if (!deletedLog) {
      return res.status(404).json({ error: 'Audit log not found' });
    }
    res.status(200).json({ message: 'Audit log deleted successfully', deletedLog });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting audit log' });
  }
});

module.exports = router;
