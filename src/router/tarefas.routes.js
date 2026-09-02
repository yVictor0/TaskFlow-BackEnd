const express = require('express');
const router = express.Router();
const TarefasController = require('../controllers/tarefas.controller');

router.get('/estatisticas', TarefasController.resumoTarefas)
router.get('/resumo', TarefasController.resumoTarefas);


router.get('/', TarefasController.listar);
router.get('/:id', TarefasController.buscarPorId);

router.post('/', TarefasController.criarTarefa); 

router.put('/:id', TarefasController.atualizarTarefas);
router.delete('/:id', TarefasController.excluirTarefas);

module.exports = router;