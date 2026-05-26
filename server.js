const express = require('express');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const leituraRoutes = require('./routes/leituraRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.use('/auth', authRoutes);
app.use('/leituras', leituraRoutes);

module.exports = app;