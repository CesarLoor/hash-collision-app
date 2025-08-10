const express = require('express');
const router = express.Router();
const multer = require('multer');
const crypto = require('crypto');
const HashHistory = require('../models/HashHistory');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_secret_key'; // Usa la misma clave que en auth.js

// Configuración de Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Carpeta donde se guardan temporalmente los archivos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para evitar sobreescritura
  }
});
const upload = multer({ storage: storage });

// Middleware para verificar JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('token requerido');
  try {
    const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send('token invalido');
  }
};

// Subida y cálculo de hashes
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).send('archivo no subido');

    const fileBuffer = require('fs').readFileSync(file.path);
    const hashes = {
      md5: crypto.createHash('md5').update(fileBuffer).digest('hex'),
      sha1: crypto.createHash('sha1').update(fileBuffer).digest('hex'),
      sha256: crypto.createHash('sha256').update(fileBuffer).digest('hex')
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

    // Eliminar archivo temporal
    require('fs').unlinkSync(file.path);

    res.json({ hashes, collision: !!collision });
  } catch (err) {
    console.error(err);
    res.status(500).send('error del servidor');
  }
});

// CRUD Historial
router.get('/history', verifyToken, async (req, res) => {
  try {
    const history = await HashHistory.find({ user: req.userId }).populate('user', 'username');
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).send('error del servidor');
  }
});

router.put('/history/:id', verifyToken, async (req, res) => {
  try {
    await HashHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send('actualizado');
  } catch (err) {
    console.error(err);
    res.status(500).send('error del servidor');
  }
});

router.delete('/history/:id', verifyToken, async (req, res) => {
  try {
    await HashHistory.findByIdAndDelete(req.params.id);
    res.send('borrado');
  } catch (err) {
    console.error(err);
    res.status(500).send('error del servidor');
  }
});

module.exports = router;