const tarefaModel = require("../models/tarefas.model.js");

const prioridadeValidas = ["Alta 🔴", "Média 🟡", "Baixa 🟢"];

const TarefasController = {
  async listar(req, res) {
    try {
      const { coluna, usuario_id, usuarioId } = req.query;
      const idUsuario = usuario_id || usuarioId;

      let resultado;
      if (idUsuario) {
        resultado = await tarefaModel.listarPorUsuario(idUsuario);
      } else {
        resultado = await tarefaModel.listar();
      }

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
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const tarefa = await tarefaModel.buscar(id);
      if (!tarefa)
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      return res.json(tarefa);
    } catch (error) {
      console.error("Erro ao buscar tarefa por ID:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },

  async criarTarefa(req, res) {
    try {
      const usuario_id = req.body.usuario_id || req.body.usuarioId;
      const projeto_id = req.body.projeto_id || req.body.projetoId || null;
      const prioridade_id =
        req.body.prioridade_id || req.body.prioridadeId || null;
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

      const todasTarefas = await tarefaModel.listar();

      const colunaNormalizada = coluna ? coluna.toLowerCase() : "afazer";
      const ehEmAndamento =
        colunaNormalizada === "andamento" ||
        colunaNormalizada === "emandamento" ||
        coluna === "Em Andamento";

      if (ehEmAndamento) {
        const tarefasEmAndamento = todasTarefas.filter(
          (t) =>
            Number(t.usuario_id || t.usuarioId) === Number(usuario_id) &&
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
      if (isNaN(idTarefa)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const { coluna } = req.body;
      const colunaNormalizada = coluna ? coluna.toLowerCase() : "";
      const ehEmAndamento =
        colunaNormalizada === "andamento" ||
        colunaNormalizada === "emandamento" ||
        coluna === "Em Andamento";

      if (ehEmAndamento) {
        const todasTarefas = await tarefaModel.listar();
        const tarefaAtual = await tarefaModel.buscar(idTarefa);

        if (tarefaAtual) {
          const idDoUsuario = tarefaAtual.usuario_id || tarefaAtual.usuarioId;

          const tarefasEmAndamento = todasTarefas.filter(
            (t) =>
              Number(t.usuario_id || t.usuarioId) === Number(idDoUsuario) &&
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
      }

      const atualizada = await tarefaModel.atualizar(idTarefa, req.body);
      if (!atualizada)
        return res.status(404).json({ erro: "Tarefa não encontrada" });

      return res.json(atualizada);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },

  async excluirTarefas(req, res) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ erro: "ID inválido" });
      }

      const removida = await tarefaModel.remover(id);
      if (!removida)
        return res.status(404).json({ erro: "nao achei essa tarefa pae" });

      return res.json({ mensagem: "Tarefa removida", tarefa: removida });
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      return res.status(500).json({ erro: "Erro interno no servidor" });
    }
  },

  async resumoTarefas(req, res) {
    try {
      const { coluna, formato } = req.query;
      const todasTarefas = await tarefaModel.listar();
      const base = coluna
        ? todasTarefas.filter((t) => t.coluna === coluna)
        : todasTarefas;

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
