const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const leituraRoutes = require('./routes/leituraRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/leituras', leituraRoutes);

app.listen(process.env.PORT, () => {
  console.log('Servidor rodando');
});