const express = require('express')
const router = express.Router()
const projetosController = require('../controllers/projetos.controller')

router.get('/', projetosController.listarProjetos)
router.get('/:id', projetosController.projetosId)
router.post('/', projetosController.adicionarNovoProjeto)
router.put('/:id', projetosController.atualizarProjeto)
router.delete('/:id', projetosController.excluirProjeto)

module.exports = router