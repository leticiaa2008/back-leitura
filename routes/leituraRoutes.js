const express = require('express');
const router = express.Router();

const {
  registrarLeitura,
  rankingTurmas,
  progressoGeral
} = require('../controllers/leituraController');

const auth = require('../middleware/authMiddleware');

router.post('/', auth, registrarLeitura);

router.get('/ranking', rankingTurmas);

router.get('/progresso', progressoGeral);

module.exports = router;