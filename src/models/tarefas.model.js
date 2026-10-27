const prisma = require("../database/prisma");

const incluirNomes = {
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } },
  prioridades: { select: { descricao: true, cor: true } },
};

function formatarTarefa(tarefa) {
  if (!tarefa) return null;

  const { projetos, usuarios, prioridades, ...resto } = tarefa;

  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade_nome: prioridades?.descricao,
    prioridade_cor: prioridades?.cor,
  };
}

const tarefasModel = {
  listar: async () => {
    const lista = await prisma.tarefas.findMany({
      include: incluirNomes,
      orderBy: { id: "asc" },
    });
    return lista.map(formatarTarefa);
  },

  buscar: async (id) => {
    const tarefa = await prisma.tarefas.findUnique({
      where: { id: Number(id) },
      include: incluirNomes,
    });

    return formatarTarefa(tarefa);
  },

  async criar(dados) {
    const {
      texto,
      coluna = "afazer",
      ordem = 0,
      usuario_id,
      prioridade_id = 1,
      projeto_id = null,
    } = dados;

    const novaTarefa = await prisma.tarefas.create({
      data: {
        texto,
        coluna,
        ordem,
        usuario_id,
        prioridade_id,
        projeto_id,
      },
      include: incluirNomes,
    });

    return formatarTarefa(novaTarefa);
  },

  async atualizar(id, dados) {
    const {
      texto,
      coluna,
      ordem,
      usuario_id,
      prioridade_id,
      projeto_id,
      concluida_em,
    } = dados;

    const tarefaAtualizada = await prisma.tarefas.update({
      where: { id: Number(id) },
      data: {
        ...(texto !== undefined && { texto }),
        ...(coluna !== undefined && { coluna }),
        ...(ordem !== undefined && { ordem }),
        ...(usuario_id !== undefined && { usuario_id }),
        ...(prioridade_id !== undefined && { prioridade_id }),
        ...(projeto_id !== undefined && { projeto_id }),
        ...(concluida_em !== undefined && { concluida_em }),
      },
      include: incluirNomes,
    });

    return formatarTarefa(tarefaAtualizada);
  },

  async deletar(id) {
    const tarefaDeletada = await prisma.tarefas.delete({
      where: { id: Number(id) },
    });

    return tarefaDeletada;
  },
};

module.exports = tarefasModel;