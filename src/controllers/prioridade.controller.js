const prioridadeModel = require("../models/prioridade.model");

const PrioridadeController = {
  async ListarPrioridade(req, res) {
    try {
      let prioridades = await prioridadeModel.listar();
      return res.json(prioridades);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res
        .status(500)
        .json({ erro: "Erro interno no servidor ao listar usuários" });
    }
  },
};

module.exports = PrioridadeController;
