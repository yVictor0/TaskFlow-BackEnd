const express = require('express')
const usuariosController = require('../controllers/usuarios.controller')

const router = express.Router()

router.get('/', usuariosController.listarUsuarios)
router.get('/:id', usuariosController.usuariosId)
router.post('/', usuariosController.adicionarNovoUsuario)
router.put('/:id', usuariosController.atualizarUsuario)
router.delete('/:id', usuariosController.excluirUsuario)

module.exports = router