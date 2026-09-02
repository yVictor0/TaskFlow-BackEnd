const express = require('express');
const router = express.Router();
const usuarioControler = require('../controllers/usuario.controller')

router.get('/', usuarioControler.usuarioControler)
router.get('/:id',  usuarioControler.usauriosId)
router.post('/', usuarioControler.adicionarNovoUsuario);
router.put('/:id', usuarioControler.atualziarUsuario);
router.delete('/:id', usuarioControler.excluirUsuario) 

module.exports = router;