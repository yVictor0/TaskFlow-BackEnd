const tarefasModel = require('../models/tarefas.model');

const tarefasController = {
  async listar(req, res) {
    try {
      const usuario_id = req.query.usuario_id || req.usuario?.id;
      if (!usuario_id) {
        return res.status(400).json({ erro: 'ID do utilizador é obrigatório.' });
      }
      const tarefas = await tarefasModel.listar(Number(usuario_id));
      return res.json(tarefas);
    } catch (error) {
      console.error('ERRO AO LISTAR TAREFAS:', error);
      return res.status(500).json({ erro: 'Erro ao carregar tarefas.' });
    }
  },

  async criar(req, res) {
    try {
      const {
        texto,
        titulo,
        coluna,
        ordem,
        usuario_id,
        usuarioId,
        prioridade_id,
        prioridade,
        projeto_id,
        cidade,
        cep
      } = req.body;

      const textoFinal = texto || titulo;
      const novoUsuarioId = usuario_id || usuarioId || req.usuario?.id;
      const prioridadeFinal = prioridade_id || prioridade || 1;

      if (!textoFinal || !novoUsuarioId) {
        return res.status(400).json({ erro: 'Texto e ID do utilizador são obrigatórios.' });
      }

      const novaTarefa = await tarefasModel.criar({
        texto: textoFinal,
        coluna: coluna || 'todo',
        ordem: ordem !== undefined ? Number(ordem) : 0,
        usuario_id: Number(novoUsuarioId),
        prioridade_id: Number(prioridadeFinal),
        projeto_id: projeto_id ? Number(projeto_id) : null,
        cidade: cidade || null,
        cep: cep || null
      });

      return res.status(201).json(novaTarefa);
    } catch (error) {
      console.error('ERRO AO CRIAR TAREFA NO CONTROLLER:', error);
      return res.status(500).json({ erro: 'Erro ao criar tarefa.' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ erro: 'ID da tarefa válido é obrigatório.' });
      }

      const {
        texto,
        titulo,
        coluna,
        ordem,
        usuario_id,
        usuarioId,
        prioridade_id,
        idprioridade,
        prioridade,
        projeto_id,
        cidade,
        cep,
        concluida
      } = req.body;

      const dadosAtualizados = {
        texto: texto || titulo,
        coluna,
        ordem: ordem !== undefined ? Number(ordem) : undefined,
        usuario_id: (usuario_id || usuarioId) ? Number(usuario_id || usuarioId) : undefined,
        prioridade_id: (prioridade_id || idprioridade || prioridade) ? Number(prioridade_id || idprioridade || prioridade) : undefined,
        projeto_id: projeto_id ? Number(projeto_id) : undefined,
        cidade,
        cep,
        concluida
      };

      // Omohenda ani ogueraha campo 'undefined'
      Object.keys(dadosAtualizados).forEach(key => dadosAtualizados[key] === undefined && delete dadosAtualizados[key]);

      const tarefaAtualizada = await tarefasModel.atualizar(Number(id), dadosAtualizados);

      if (!tarefaAtualizada) {
        return res.status(404).json({ erro: 'Tarefa não encontrada.' });
      }

      return res.json(tarefaAtualizada);
    } catch (error) {
      console.error('ERRO AO ATUALIZAR TAREFA:', error);
      return res.status(500).json({ erro: 'Erro interno ao atualizar tarefa.' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ erro: 'ID da tarefa válido é obrigatório.' });
      }

      const tarefaDeletada = await tarefasModel.deletar(Number(id));

      if (!tarefaDeletada) {
        return res.status(404).json({ erro: 'Tarefa não encontrada.' });
      }

      return res.status(200).json({ mensagem: 'Tarefa eliminada com sucesso!', tarefa: tarefaDeletada });
    } catch (error) {
      console.error('ERRO AO DELETAR TAREFA:', error);
      return res.status(500).json({ erro: 'Erro ao apagar tarefa.' });
    }
  }
};

module.exports = tarefasController;