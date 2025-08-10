const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const HashHistory = require('../models/HashHistory');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key';

const upload = multer({ dest: 'uploads/' }); // Carpeta para archivos temporales.

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token required');
  try {
    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

// Subida y cálculo de hashes
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  const file = req.file;
  const hashes = {
    md5: crypto.createHash('md5').update(require('fs').readFileSync(file.path)).digest('hex'),
    sha1: crypto.createHash('sha1').update(require('fs').readFileSync(file.path)).digest('hex'),
    sha256: crypto.createHash('sha256').update(require('fs').readFileSync(file.path)).digest('hex')
  };

  // Verificar colisiones
  const collision = await HashHistory.findOne({
    $or: [{ md5: hashes.md5 }, { sha1: hashes.sha1 }, { sha256: hashes.sha256 }]
  });

  const newHash = new HashHistory({
    filename: file.originalname,
    ...hashes,
    user: req.userId
  });
  await newHash.save();

  require('fs').unlinkSync(file.path); // Eliminar archivo temporal.

  res.json({ hashes, collision: !!collision });
});

// CRUD Historial
router.get('/history', verifyToken, async (req, res) => {
  const history = await HashHistory.find({ user: req.userId }).populate('user', 'username');
  res.json(history);
});

router.put('/history/:id', verifyToken, async (req, res) => {
  await HashHistory.findByIdAndUpdate(req.params.id, req.body);
  res.send('Updated');
});

router.delete('/history/:id', verifyToken, async (req, res) => {
  await HashHistory.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

module.exports = router;