const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/hashdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Rutas
app.use('/auth', require('./routes/auth'));
app.use('/hash', require('./routes/hash'));

app.listen(port, () => console.log(`Server running on port ${port}`));