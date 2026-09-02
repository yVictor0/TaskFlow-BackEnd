let tarefas = [
    {
    "id": 1,
    "texto": "",
    "prioridade": "media",
    "coluna": "afazer"
    },
];

let arefa = tarefas
let proximoId = 2;

const TarefasController = { 

    listar(req, res) {
        const { coluna } = req.query;
        let resultado = tarefas;
        if (coluna) resultado = tarefas.filter(t => t.coluna === coluna);
        res.json(resultado);
    },

    buscarPorId(req, res) {
        const id = parseInt(req.params.id);
        const tarefa = tarefas.find(t => t.id === id);
        if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(tarefa);
    },

    criarTarefa(req, res) {
        const { texto, prioridade, coluna } = req.body;
        if (!texto) return res.status(400).json({ erro: 'texto obrigatorio' });

        const nova = { 
            id: proximoId++, 
            texto: '', 
            prioridade: prioridade || 'media', 
            coluna: coluna || 'afazer' 
        };
        tarefas.push(nova);
        res.status(201).json(nova);
    },

    atualizarTarefas(req, res) {
        const id = parseInt(req.params.id);
        const idx = tarefas.findIndex(t => t.id === id);
        if (idx === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

        tarefas[idx] = { ...tarefas[idx], ...req.body, id };
        res.json(tarefas[idx]);
    },

    excluirTarefas(req, res) {
        const id = parseInt(req.params.id);
        const idx = tarefas.findIndex(t => t.id === id);

        if (idx === -1) return res.status(404).json({ erro: 'nao achei essa tarefa pae' });
        const removida = tarefas.splice(idx, 1)[0];
        res.json({ mensagem: 'Tarefa removida', tarefa: removida });
    },

    // estatisticas(req, res) {
    //     const { coluna } = req.query;
    //     const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas;
    //     const porColuna = {
    //         afazer: base.filter(t => t.coluna === 'afazer').length,
    //         andamento: base.filter(t => t.coluna === 'andamento').length,
    //         concluido: base.filter(t => t.coluna === 'concluido').length,
    //     };
       
    // },

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

    return res.json({
        total: base.length,
        filtroAplicado: coluna,
        porColuna
    });
}
}

module.exports = TarefasController;