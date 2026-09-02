const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

router.get('/', usuariosController.listarUsuarios);
router.get('/:id', usuariosController.usauriosId);
router.post('/', usuariosController.adicionarNovoUsuario);
router.put('/:id', usuariosController.atualizarUsuario);
router.delete('/:id', usuariosController.excluirUsuario);

module.exports = router;