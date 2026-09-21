const tarefaModel = require('../models/tarefas.model.js');

const prioridadeValidas = ['Alta 🔴', 'Média 🟡', 'Baixa 🟢'];

const TarefasController = { 

    listar(req, res) {
        const { coluna } = req.query;
        let resultado = coluna
            ? tarefaModel.listarPorColuna(coluna)
            : tarefaModel.listar();
        res.json(resultado);
    },

    buscarPorId(req, res) {
        const tarefa = tarefaModel.buscar(parseInt(req.params.id));
        if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(tarefa);
    },

    criarTarefa(req, res) {
        try {
            const { texto, prioridade, coluna, usuarioId } = req.body;

            if (!usuarioId) {
                return res.status(400).json({ erro: 'O id do usuário é obrigatório' });
            }

            if (!texto) {
                return res.status(400).json({ erro: 'precisa adicionar um texto' });
            }

            if (prioridade && !prioridadeValidas.includes(prioridade)) {
                return res.status(400).json({ erro: 'esse tipo de prioridade nao existe' });
            }

            // 1. Busca todas as tarefas cadastradas no model
            const todasTarefas = tarefaModel.listar();

            // 2. Identifica se a tarefa está sendo criada para a coluna de andamento
            const ehEmAndamento = coluna === 'andamento' || coluna === 'emAndamento';

            // 3. SE for para "Em Andamento", conta APENAS as tarefas nessa coluna para este usuário
            if (ehEmAndamento) {
                const tarefasEmAndamento = todasTarefas.filter(
                    t => t.usuarioId === usuarioId && (t.coluna === 'andamento' || t.coluna === 'emAndamento')
                );

                if (tarefasEmAndamento.length >= 2) {
                    return res.status(400).json({ erro: 'vc tem tarefas dms' });
                }
            }

            const novaTarefa = tarefaModel.adicionar({ texto, prioridade, coluna, usuarioId });
            return res.status(201).json(novaTarefa);

        } catch (error) {
            if (error.status === 400) {
                return res.status(400).json({ erro: error.message });
            }
            return res.status(500).json({ erro: 'Erro interno no servidor' });
        }
    },

    atualizarTarefas(req, res) {
        const idTarefa = parseInt(req.params.id);
        const { coluna } = req.body;

        // Se a requisição tentar mover a tarefa para a coluna "Em Andamento"
        const ehEmAndamento = coluna === 'andamento' || coluna === 'emAndamento';

        if (ehEmAndamento) {
            const todasTarefas = tarefaModel.listar();
            const tarefaAtual = tarefaModel.buscar(idTarefa);

            if (tarefaAtual) {
                // Conta quantas tarefas o usuário já tem em andamento (desconsiderando a própria tarefa que está sendo editada)
                const tarefasEmAndamento = todasTarefas.filter(
                    t => t.usuarioId === tarefaAtual.usuarioId && 
                         t.id !== idTarefa && 
                         (t.coluna === 'andamento' || t.coluna === 'emAndamento')
                );

                if (tarefasEmAndamento.length >= 2) {
                    return res.status(400).json({ erro: 'vc tem tarefas dms' });
                }
            }
        }

        const atualizada = tarefaModel.atualizar(idTarefa, req.body);
        if (!atualizada) return res.status(404).json({ erro: 'Tarefa não encontrada' });
        res.json(atualizada);
    },

    excluirTarefas(req, res) {
        const removida = tarefaModel.remover(parseInt(req.params.id));
        if (!removida) return res.status(404).json({ erro: 'nao achei essa tarefa pae' });
        res.json({ mensagem: 'Tarefa removida', tarefa: removida });
    },

    resumoTarefas(req, res) {
        const { coluna, formato } = req.query;
        const todasTarefas = tarefaModel.listar();
        const base = coluna ? todasTarefas.filter(t => t.coluna === coluna) : todasTarefas;
        
        const porColuna = {
            afazer: base.filter(t => t.coluna === 'afazer').length,
            andamento: base.filter(t => t.coluna === 'andamento' || t.coluna === 'emAndamento').length,
            concluido: base.filter(t => t.coluna === 'concluido').length,
        };

        if (formato === 'texto') {
            const textoColuna = coluna ? ` na coluna "${coluna}"` : '';
            return res.send(
                `Você tem ${base.length} tarefas${textoColuna}. ${porColuna.concluido} concluídas, ${porColuna.andamento} em andamento e ${porColuna.afazer} a fazer.`
            );
        }

        return res.json({ total: base.length, porColuna });
    }
};

module.exports = TarefasController;