import express from 'express';
const router = express.Router();

// Base api route
router.get('/', (req, res) => {
    res.json({ message: 'API Base Route' });
});

export default router;
