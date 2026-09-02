const { Router } = require('express');
const ProjetoController = require('../controllers/projeto.controller');
const router = Router();

router.get('/resumo', ProjetoController.resumoTarefas);
router.post('/', ProjetoController.criar);
router.get('/', ProjetoController.listar);
router.get('/:id', ProjetoController.buscarPorId);
router.put('/:id', ProjetoController.atualizar);
router.delete('/:id', ProjetoController.deletar);

module.exports = router;