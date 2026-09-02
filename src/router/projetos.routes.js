const { Router } = require('express');
const projetosController = require('../controllers/projetos.controller');

const router = Router();

router.get('/', projetosController.listarProjetos);
router.get('/:id', projetosController.projetosId);
router.post('/', projetosController.adicionarNovoProjeto);
router.put('/:id', projetosController.atualizarProjeto);
router.delete('/:id', projetosController.excluirProjeto);

module.exports = router;