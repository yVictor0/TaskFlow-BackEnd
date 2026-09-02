// apenas pega as rotas e a funçao

const express = require('express')
const router = express.Router()
const TarefasController = require('../controllers/tarefas.controller')


router.get('/estatisticas', tarefasController.estatisticas);

router.get('/', TarefasController.listar) 
router.get('/:id', TarefasController.buscarPorId) //funcao > buscarPorId
router.post('/', TarefasController.criarTarefas)
router.put('/:id', TarefasController.atualizarTarefas);
router.delete('/:id', TarefasController.excluirTarefas)

module.exports = router;