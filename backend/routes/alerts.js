import express from 'express';
const router = express.Router();
import Alert from '../models/alert.js';

// Fetch alerts
router.get('/', async (req, res) => {
    const { severity, isRead } = req.query;
    const filter = {};
    if (severity) filter.severity = severity;
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const alerts = await Alert.find(filter).sort({ timestamp: -1 });
    res.json(alerts);
});

// Create new alert
router.post('/', async (req, res) => {
    try {
        const newAlert = new Alert(req.body);
        await newAlert.save();
        res.status(201).json(newAlert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
    try {
        const updatedAlert = await Alert.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(updatedAlert);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Dismiss alert
router.delete('/:id', async (req, res) => {
    try {
        await Alert.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;