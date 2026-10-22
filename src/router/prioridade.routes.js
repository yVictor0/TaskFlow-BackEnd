const express = require('express');
const router = express.Router();

// Verifique se o caminho da pasta até o controller está correto
const PrioridadeController = require('../controllers/prioridade.controller');

// Chama 'ListarPrioridade' com 'L' maiúsculo
router.get('/', PrioridadeController.ListarPrioridade);

module.exports = router;