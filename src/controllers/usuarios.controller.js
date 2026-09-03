let usuarios = [];
let proximoId = 1;

const usuariosController = {
    listarUsuarios(req, res) {
        res.json(usuarios);
    },

    usuariosId(req, res) {
        const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
        if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.json(usuario);
    },

    adicionarNovoUsuario(req, res) {
        const { nome, email } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome do usuário é obrigatório' });
        if (!email) return res.status(400).json({ erro: 'O e-mail do usuário é obrigatório' });

        const novoUsuario = {
            id: proximoId++,
            nome,
            email,
        };

        usuarios.push(novoUsuario);
        res.status(201).json(novoUsuario);
    },

    atualizarUsuario(req, res) {
        const id = parseInt(req.params.id);
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

        usuarios[idx] = { ...usuarios[idx], ...req.body, id: usuarios[idx].id };
        res.json(usuarios[idx]);
    },

    excluirUsuario(req, res) {
        const id = parseInt(req.params.id);
        const idx = usuarios.findIndex(u => u.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });

        const removido = usuarios.splice(idx, 1)[0];
        res.json({ mensagem: 'Usuário removido com sucesso', usuario: removido });
    }
};

module.exports = usuariosController;