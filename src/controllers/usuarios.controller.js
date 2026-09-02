let tarefas = [];
let proximoId = 1;

const projetoController = {
    listarTarefas(req, res) {
        const { coluna } = req.query;
        if (coluna) {
            const filtradas = tarefas.filter(t => t.coluna === coluna);
            return res.json(filtradas);
        }
        res.json(tarefas);
    },

    tarefasId(req, res) {
        const tarefa = tarefas.find(t => t.id === parseInt(req.params.id));
        if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(tarefa);
    },

    adicionarNovaTarefa(req, res) {
        const { titulo, descricao, coluna } = req.body;
        if (!titulo) return res.status(400).json({ erro: 'O título é obrigatório' });

        const novaTarefa = {
            id: proximoId++,
            titulo,
            descricao: descricao || '',
            coluna: coluna || 'afazer'
        };

        tarefas.push(novaTarefa);
        res.status(201).json(novaTarefa);
    },

    atualizarTarefa(req, res) {
        const id = parseInt(req.params.id);
        const idx = tarefas.findIndex(t => t.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

        tarefas[idx] = { ...tarefas[idx], ...req.body, id: tarefas[idx].id };
        res.json(tarefas[idx]);
    },

    excluirTarefa(req, res) {
        const id = parseInt(req.params.id);
        const idx = tarefas.findIndex(t => t.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Não achei essa tarefa pae' });

        const removido = tarefas.splice(idx, 1)[0];
        res.json({ mensagem: 'Tarefa removida', tarefa: removido });
    },

    resumoTarefas(req, res) {
        const { coluna, formato } = req.query;
        const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas;

        const porColuna = {
            afazer: base.filter(t => t.coluna === 'afazer').length,
            andamento: base.filter(t => t.coluna === 'andamento').length,
            concluido: base.filter(t => t.coluna === 'concluido').length,
        };

        if (formato === 'texto') {
            const textoColuna = coluna ? ` na coluna "${coluna}"` : '';
            return res.send(
                `Você tem ${base.length} tarefas${textoColuna}. ${porColuna.concluido} concluídas, ${porColuna.andamento} em andamento e ${porColuna.afazer} a fazer.`
            );
        }

        res.json({
            total: base.length,  filtroAplicado: coluna || 'nenhum',  porColuna
        });
    }
};

module.exports = projetoController;