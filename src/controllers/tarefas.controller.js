
const tarefaModel = require('../models/tarefas.model.js');

const TarefasController = { 

    listar(req, res) {
        const { coluna } = req.query
        let resultado = coluna
        ? tarefaModel.listarPorColuna(coluna)
        : tarefaModel.listar()
        res.json(resultado)

    },

    buscarPorId(req, res) {

        const tarefa = tarefaModel.buscar(parseInt(req.params.id))
        if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' })
        res.json(tarefa);
    },

    criarTarefa(req, res) {
    try {
        // Recebe o usuarioId (junto com os outros campos) do BODY
        const { texto, prioridade, coluna, usuarioId } = req.body;

        if (!texto) {
            return res.status(400).json({ erro: 'precisa adicionar um texto' });
        }

        // Tenta adicionar no model
        const novaTarefa = tarefaModel.adicionar({ texto, prioridade, coluna, usuarioId });

        return res.status(201).json(novaTarefa);

    } catch (error) {
        // Captura o erro disparado caso o usuarioId informado seja inválido
        if (error.status === 400) {
            return res.status(400).json({ erro: error.message });
        }

        return res.status(500).json({ erro: 'Erro interno no servidor' });
    }
},

    atualizarTarefas(req, res) {
        const atualizada = tarefaModel.atualizarTarefas(parseInt(req.params.id))
        if (!atualizada) return res.status(404).json({ erro: 'Tarefa não encontrada' })
        res.json(tarefas[idx]);
    },

    excluirTarefas(req, res) {
        const removida = tarefaModel.remover(parseInt(req.params.id))
        if (!removida) return res.status(404).json({ erro: 'nao achei essa tarefa pae' })
        res.json({ mensagem: 'Tarefa removida', tarefa: removida })
    },

    // estatisticas(req, res) {
    //     const { coluna } = req.query
    //     const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas
    //     const porColuna = {
    //         afazer: base.filter(t => t.coluna === 'afazer').length,
    //         andamento: base.filter(t => t.coluna === 'andamento').length,
    //         concluido: base.filter(t => t.coluna === 'concluido').length,
    //     }
       
    // },



   resumoTarefas(req, res) {
    const { coluna, formato } = req.query;
    const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas
    const porColuna = {
        afazer: base.filter(t => t.coluna === 'afazer').length,
        andamento: base.filter(t => t.coluna === 'andamento').length,
        concluido: base.filter(t => t.coluna === 'concluido').length,
    };

    if (formato === 'texto') {
        const textoColuna = coluna ? ` na coluna "${coluna}"` : ''
        return res.send(
            `Você tem ${base.length} tarefas${textoColuna}. ${porColuna.concluido} concluídas, ${porColuna.andamento} em andamento e ${porColuna.afazer} a fazer.`
        )
    }

    return res.json({total: base.length, porColuna})
    }
    //quebra  cabeça ^

}

module.exports = TarefasController