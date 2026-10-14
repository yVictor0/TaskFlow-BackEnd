const tarefaModel = require("../models/tarefas.model.js");

const prioridadeValidas = ["Alta 🔴", "Média 🟡", "Baixa 🟢"];

const TarefasController = {
  async listar(req, res) {
    try {
      const { coluna, usuario_id, usuarioId } = req.query;
      // Dá prioridade ao req.user.id (caso use Middleware JWT/Auth) ou ao parâmetro informado
      const idUsuario = req.user?.id || usuario_id || usuarioId;

      if (!idUsuario) {
        return res.status(400).json({ erro: "O id do usuário é obrigatório para listar as tarefas." });
      }

      // NUNCA listamos tudo do banco. Buscamos APENAS do usuário informado
      let resultado = await tarefaModel.listarPorUsuario(idUsuario);

      if (coluna) {
        resultado = resultado.filter(
          (t) => t.coluna && t.coluna.toLowerCase() === coluna.toLowerCase(),
        );
      }

      return res.json(resultado);
    } catch (error) {
      console.error("Erro ao listar tarefas:", error);
      return res.status(500).json({ erro: "Erro interno ao listar tarefas" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idUsuario = req.user?.id || req.query.usuario_id || req.query.usuarioId;

      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const tarefa = await tarefaModel.buscar(id);
      if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      // Trava de Segurança: verifica se a tarefa pertence ao usuário requisitante
      if (idUsuario && Number(tarefa.usuario_id || tarefa.usuarioId) !== Number(idUsuario)) {
        return res.status(403).json({ erro: "Você não tem permissão para ver esta tarefa" });
      }

      return res.json(tarefa);
    } catch (error) {
      console.error("Erro ao buscar tarefa por ID:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },

  async criarTarefa(req, res) {
    try {
      const usuario_id = req.user?.id || req.body.usuario_id || req.body.usuarioId;
      const projeto_id = req.body.projeto_id || req.body.projetoId || null;
      const prioridade_id = req.body.prioridade_id || req.body.prioridadeId || null;
      const { texto, prioridade, coluna, ordem } = req.body;

      if (!usuario_id) {
        return res.status(400).json({ erro: "O id do usuário é obrigatório" });
      }

      if (!texto) {
        return res.status(400).json({ erro: "precisa adicionar um texto" });
      }

      if (prioridade && !prioridadeValidas.includes(prioridade)) {
        return res
          .status(400)
          .json({ erro: "esse tipo de prioridade nao existe" });
      }

      // Busca APENAS as tarefas deste usuário para verificar o limite "Em Andamento"
      const tarefasDoUsuario = await tarefaModel.listarPorUsuario(usuario_id);

      const colunaNormalizada = coluna ? coluna.toLowerCase() : "afazer";
      const ehEmAndamento =
        colunaNormalizada === "andamento" ||
        colunaNormalizada === "emandamento" ||
        coluna === "Em Andamento";

      if (ehEmAndamento) {
        const tarefasEmAndamento = tarefasDoUsuario.filter(
          (t) =>
            t.coluna &&
            (t.coluna.toLowerCase() === "andamento" ||
              t.coluna.toLowerCase() === "emandamento" ||
              t.coluna === "Em Andamento"),
        );

        if (tarefasEmAndamento.length >= 2) {
          return res
            .status(400)
            .json({ erro: "vc tem tarefas dms em andamento" });
        }
      }

      const novaTarefa = await tarefaModel.adicionar({
        texto,
        coluna: coluna || "A Fazer",
        ordem: ordem || 1,
        usuario_id,
        projeto_id,
        prioridade_id,
      });

      return res.status(201).json(novaTarefa);
    } catch (error) {
      console.error("ERRO REAL NO BANCO:", error);
      return res
        .status(500)
        .json({ erro: error.message || "Erro interno no servidor" });
    }
  },

  async atualizarTarefas(req, res) {
    try {
      const idTarefa = parseInt(req.params.id);
      const idUsuario = req.user?.id || req.body.usuario_id || req.body.usuarioId || req.query.usuario_id;

      if (isNaN(idTarefa)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const tarefaAtual = await tarefaModel.buscar(idTarefa);
      if (!tarefaAtual) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      // Trava de Segurança: impede alterar tarefa de outro usuário
      const donoDaTarefa = tarefaAtual.usuario_id || tarefaAtual.usuarioId;
      if (idUsuario && Number(donoDaTarefa) !== Number(idUsuario)) {
        return res.status(403).json({ erro: "Você não tem permissão para alterar esta tarefa" });
      }

      const { coluna } = req.body;
      const colunaNormalizada = coluna ? coluna.toLowerCase() : "";
      const ehEmAndamento =
        colunaNormalizada === "andamento" ||
        colunaNormalizada === "emandamento" ||
        coluna === "Em Andamento";

      if (ehEmAndamento) {
        // Valida o limite de 2 tarefas apenas dentro das tarefas do dono da tarefa
        const tarefasDoUsuario = await tarefaModel.listarPorUsuario(donoDaTarefa);

        const tarefasEmAndamento = tarefasDoUsuario.filter(
          (t) =>
            Number(t.id) !== idTarefa &&
            t.coluna &&
            (t.coluna.toLowerCase() === "andamento" ||
              t.coluna.toLowerCase() === "emandamento" ||
              t.coluna === "Em Andamento"),
        );

        if (tarefasEmAndamento.length >= 2) {
          return res
            .status(400)
            .json({ erro: "vc tem tarefas dms em andamento" });
        }
      }

      const atualizada = await tarefaModel.atualizar(idTarefa, req.body);
      return res.json(atualizada);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },

  async excluirTarefas(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idUsuario = req.user?.id || req.query.usuario_id || req.body.usuario_id;

      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const tarefaAtual = await tarefaModel.buscar(id);
      if (!tarefaAtual) {
        return res.status(404).json({ erro: "nao achei essa tarefa pae" });
      }

      // Trava de Segurança: impede excluir tarefa alheia
      if (idUsuario && Number(tarefaAtual.usuario_id || tarefaAtual.usuarioId) !== Number(idUsuario)) {
        return res.status(403).json({ erro: "Você não tem permissão para excluir esta tarefa" });
      }

      const removida = await tarefaModel.remover(id);
      return res.json({ mensagem: "Tarefa removida", tarefa: removida });
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },

  async resumoTarefas(req, res) {
    try {
      const { coluna, formato, usuario_id, usuarioId } = req.query;
      const idUsuario = req.user?.id || usuario_id || usuarioId;

      if (!idUsuario) {
        return res.status(400).json({ erro: "O id do usuário é obrigatório para o resumo." });
      }

      // Busca APENAS as tarefas do usuário logado para o resumo
      const tarefasDoUsuario = await tarefaModel.listarPorUsuario(idUsuario);

      const base = coluna
        ? tarefasDoUsuario.filter((t) => t.coluna === coluna)
        : tarefasDoUsuario;

      const porColuna = {
        afazer: base.filter(
          (t) =>
            t.coluna &&
            (t.coluna.toLowerCase() === "afazer" || t.coluna === "A Fazer"),
        ).length,
        andamento: base.filter(
          (t) =>
            t.coluna &&
            (t.coluna.toLowerCase() === "andamento" ||
              t.coluna.toLowerCase() === "emandamento" ||
              t.coluna === "Em Andamento"),
        ).length,
        concluido: base.filter(
          (t) =>
            t.coluna &&
            (t.coluna.toLowerCase() === "concluido" ||
              t.coluna === "Concluído"),
        ).length,
      };

      if (formato === "texto") {
        const textoColuna = coluna ? ` na coluna "${coluna}"` : "";
        return res.send(
          `Você tem ${base.length} tarefas${textoColuna}. ${porColuna.concluido} concluídas, ${porColuna.andamento} em andamento e ${porColuna.afazer} a fazer.`,
        );
      }

      return res.json({ total: base.length, porColuna });
    } catch (error) {
      console.error("Erro ao gerar resumo de tarefas:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },
};

module.exports = TarefasController;