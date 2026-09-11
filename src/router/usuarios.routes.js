const express = require('express')

const validar = require('../middlewares/validar');
const schemas = require('../middlewares/schemas');
const usuariosController = require('../controllers/usuarios.controller')

const router = express.Router()

router.get('/', usuariosController.listarUsuarios)
router.get('/:id', usuariosController.usuariosId)
router.post('/', validar(schemas.usuario), usuariosController.adicionarNovoUsuario)
router.put('/:id', validar(schemas.usuario), usuariosController. atualizarUsuario)
router.delete('/:id', usuariosController.excluirUsuario)

module.exports = router