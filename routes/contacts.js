const router = require('express').Router();
const Contact = require('../models/Contact');

// Create
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const doc = await Contact.create({ name, email, phone });
    res.status(201).json({ ok: true, data: doc });
  } catch (err) {
        if (err && err.code === 11000) {
      const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
      return res.status(409).json({ ok: false, error: `${field} already exists` });
    }

    // Mongoose validation errors
    if (err && err.name === 'ValidationError') {
      const msg = Object.values(err.errors).map(e => e.message).join(', ');
      return res.status(400).json({ ok: false, error: msg });
    }

    next(err);
  }
});

// Read (all)
router.get('/', async (req, res, next) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 });
    res.json({ ok: true, data: list });
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const del = await Contact.findByIdAndDelete(req.params.id);
    if (!del) {
      return res.status(404).json({ ok: false, error: 'Contact not found' });
    }
    res.json({ ok: true, data: del });
  } catch (err) {
    next(err);
  }
});

module.exports = router;