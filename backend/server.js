const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Para parsear JSON
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear formularios URL-encoded (opcional, pero útil)

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/hashdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Rutas
app.use('/auth', require('./routes/auth')); // Asegúrate de que esta línea esté después de los middlewares

app.listen(port, () => console.log(`Server running on port ${port}`));