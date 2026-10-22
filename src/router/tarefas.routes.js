const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefas.controller');

router.get('/', tarefasController.listar);
router.post('/', tarefasController.criar);
router.put('/:id', tarefasController.atualizar);
router.delete('/:id', tarefasController.deletar);

module.exports = router;