const usuarioModel = require('../models/usuarios.model');

const usuariosController = {
    async listarUsuarios(req, res) {
        let teste = await usuarioModel.listar();
        res.json(teste);
    },

    async usuariosId(req, res) {
        const id = parseInt(req.params.id);
        const usuario = await usuarioModel.buscar(id);
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    async adicionarNovoUsuario(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome) return res.status(400).json({ erro: 'O nome é obrigatório' });
    if (!email) return res.status(400).json({ erro: 'O e-mail é obrigatório' });
    if (!senha) return res.status(400).json({ erro: 'A senha é obrigatória' });

    const novoUsuario = await usuarioModel.adicionar({ nome, email, senha });
    res.status(201).json(novoUsuario);
},

    async atualizarUsuario(req, res) {
        const id = parseInt(req.params.id);
        const usuarioAtualizado = await usuarioModel.atualizar(id, req.body);
        if (!usuarioAtualizado) return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.json(usuarioAtualizado);
    },

    async excluirUsuario(req, res) {
        const id = parseInt(req.params.id);
        const removido = await usuarioModel.remover(id);
        if (!removido) return res.status(404).json({ erro: 'Usuário não encontrado' });

        res.json({ mensagem: 'Usuário removido com sucesso', usuario: removido });
    }
};

module.exports = usuariosController;