let projetos = [];
let proximoId = 1;

const projetosController = {
    listarProjetos(req, res) {
        res.json(projetos);
    },

    projetosId(req, res) {
        const projeto = projetos.find(p => p.id === parseInt(req.params.id));
        if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });
        res.json(projeto);
    },

    adicionarNovoProjeto(req, res) {
        const { nome, descricao } = req.body;
        if (!nome) return res.status(400).json({ erro: 'O nome do projeto é obrigatório' });

        const novoProjeto = {
            id: proximoId++,
            nome,
            descricao: descricao || ''
        };

        projetos.push(novoProjeto);
        res.status(201).json(novoProjeto);
    },

    atualizarProjeto(req, res) {
        const id = parseInt(req.params.id);
        const idx = projetos.findIndex(p => p.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Projeto não encontrado' });

        projetos[idx] = { ...projetos[idx], ...req.body, id: projetos[idx].id };
        res.json(projetos[idx]);
    },

    excluirProjeto(req, res) {
        const id = parseInt(req.params.id);
        const idx = projetos.findIndex(p => p.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Não achei esse projeto pae' });

        const removido = projetos.splice(idx, 1)[0];
        res.json({ mensagem: 'Projeto removido', projeto: removido });
    }
};

module.exports = projetosController;