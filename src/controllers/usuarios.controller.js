const usuarioModel = require('../models/usuario.model');

const usuariosController = {
    listarUsuarios(req, res) {
        res.json(usuarioModel.listar());
    },

    usuariosId(req, res) {
        const id = parseInt(req.params.id);
        const usuario = usuarioModel.buscar(id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    adicionarNovoUsuario(req, res) {
        const { nome, email } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome do usuário é obrigatório' });
        if (!email) return res.status(400).json({ erro: 'O e-mail do usuário é obrigatório' });

        const novoUsuario = usuarioModel.adicionar({ nome, email });
        res.status(201).json(novoUsuario);
    },

    atualizarUsuario(req, res) {
        const id = parseInt(req.params.id);
        const usuarioAtualizado = usuarioModel.atualizar(id, req.body);
        if (!usuarioAtualizado) return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.json(usuarioAtualizado);
    },

    excluirUsuario(req, res) {
        const id = parseInt(req.params.id);
        const removido = usuarioModel.remover(id);
        if (!removido) return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.json({ mensagem: 'Usuário removido com sucesso', usuario: removido });
    }
};

module.exports = usuariosController;
