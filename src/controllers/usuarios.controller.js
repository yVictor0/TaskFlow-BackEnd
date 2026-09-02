let usuarios = [];
let proximoId = 1;


const usuarioControler ={
        listarUsuarios(req, res){
            res.json(usuarios);
        },

        usauriosId(req, res){
            const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
            if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' }); 
            res.json(usuario);
        },

        adicionarNovoUsuario(req, res){
            const { nome, email } = req.body;
            if (!nome || !email) return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
            if (usuarios.find(u => u.email === email)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
            }
            const novoUsuario = { id: proximoId++, nome, email };
            usuarios.push(novoUsuario);
            res.status(201).json(novoUsuario);

        },

        atualziarUsuario(req, res){
            const id = parseInt(req.params.id);
            const idx = usuarios.findIndex(u => u.id === id);
            if (idx === -1) return res.status(404).json({ erro: 'Usuário não encontrado' });
            usuarios[idx] = { ...usuarios[idx], ...req.body, id: usuarios[idx].id };
            res.json(usuarios[idx]);

        },

        excluirUsuario(req, res){
            const id = parseInt(req.params.id);
            const idx = usuarios.findIndex(u => u.id === id);
            if (idx === -1) return res.status(404).json({ erro: 'Não achei esse usuário pae' });
            const removido = usuarios.splice(idx, 1)[0];
            res.json({ mensagem: 'Usuário removido', usuario: removido });

        },

}   