// apenas pega as rotas e a funçao

const express = require('express')
const router = express.Router()
const TarefasController = require('../controllers/tarefas.controller')


router.get('/estatisticas', tarefasController.estatisticas);

router.get('/', TarefasController) 
router.get('/:id', buscarPorId) //funcao > buscarPorId
router.post('/', criarTarefas)
router.put('/:id', atualizarTarefas);
router.delete('/:id', excluirTarefas)

module.exports = router;