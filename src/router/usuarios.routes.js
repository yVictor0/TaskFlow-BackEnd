const express = require('express');
const router = express.Router();
const usuarioControler = require('../controllers/usuario.controller')

router.get('/', usuarioControler)
router.get('/:id',  usauriosId)
router.post('/', adicionarNovoUsuario);
router.put('/:id', atualziarUsuario);
router.delete('/:id', excluirUsuario) 

module.exports = router;