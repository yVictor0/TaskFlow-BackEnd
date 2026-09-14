const express = require('express');
const router = express.Router();

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
const TarefasController = require('../controllers/tarefas.controller');

router.get('/estatisticas', TarefasController.resumoTarefas);
router.get('/resumo', TarefasController.resumoTarefas);
router.get('/', TarefasController.listar);
router.get('/:id', TarefasController.buscarPorId);

router.post(
    '/', 
    validar(schemas.tarefa), 
    TarefasController.criarTarefa 
);

router.put(
    '/:id',
    validar(schemas.tarefa),
    autenticar, TarefasController.atualizarTarefas
)
router.delete('/:id', autenticar, TarefasController.excluirTarefas);

module.exports = router;