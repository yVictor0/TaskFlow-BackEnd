const db = require("../database/db");
const prisma = require("../database/prisma");

const prioridadeModel = {
  listar: async () => {
    return prisma.prioridades.findMany({
      where: { ativo: true },

      select: { id: true, descricao: true },

      orderBy: { id: "asc" },
    });
  },
};

module.exports = prioridadeModel;
