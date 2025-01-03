import express from 'express';
const router = express.Router();
import { client } from '../config/db.js'; // PostgreSQL client

// Fetch alerts with pagination
router.get('/', async (req, res) => {
    const { severity, isRead, page = 1, pageSize = 10 } = req.query;

    let query = 'SELECT * FROM alerts';
    const conditions = [];
    const values = [];
    let valueIndex = 1;

    if (severity) {
        conditions.push(`severity = $${valueIndex++}`);
        values.push(severity);
    }
    if (isRead !== undefined) {
        conditions.push(`is_read = $${valueIndex++}`);
        values.push(isRead === 'true');
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }
    query += ' ORDER BY timestamp DESC';

    const offset = (page - 1) * pageSize;
    query += ` LIMIT $${valueIndex++} OFFSET $${valueIndex}`;
    values.push(parseInt(pageSize), offset);

    try {
        const result = await client.query(query, values);
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create new alert
router.post('/', async (req, res) => {
    const { type, message, severity, isRead } = req.body;

    const query = `
        INSERT INTO alerts (type, message, severity, is_read, timestamp)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *`;
    const values = [type, message, severity, isRead || false];

    try {
        const result = await client.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Mark as read
router.patch('/:id/read', async (req, res) => {
    const query = `
        UPDATE alerts
        SET is_read = NOT is_read
        WHERE id = $1
        RETURNING *`;
    const values = [req.params.id];

    try {
        const result = await client.query(query, values);
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Alert not found' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Dismiss alert
router.delete('/:id', async (req, res) => {
    const query = 'DELETE FROM alerts WHERE id = $1';
    const values = [req.params.id];

    try {
        const result = await client.query(query, values);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Alert not found' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
