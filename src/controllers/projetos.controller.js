const prisma = require('../database/prisma');

const projetosController = {
  async listarProjetos(req, res) {
    try {
      const projetos = await prisma.projetos.findMany();
      return res.json(projetos);
    } catch (error) {
      console.error('Erro ao listar projetos:', error);
      return res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  },

  async projetosId(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

      const projeto = await prisma.projetos.findUnique({ where: { id } });
      if (!projeto) return res.status(404).json({ erro: 'Projeto não encontrado' });

      return res.json(projeto);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  },

  async adicionarNovoProjeto(req, res) {
    try {
      const { nome, descricao, usuario_id } = req.body;
      const idUser = usuario_id || req.usuario?.id;

      if (!nome || !idUser) {
        return res.status(400).json({ erro: 'Nome e ID do usuário são obrigatórios' });
      }

      const novoProjeto = await prisma.projetos.create({
        data: {
          nome,
          descricao,
          usuario_id: Number(idUser)
        }
      });

      return res.status(201).json(novoProjeto);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao criar projeto' });
    }
  },

  async atualizarProjeto(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

      const { nome, descricao } = req.body;

      const projetoAtualizado = await prisma.projetos.update({
        where: { id },
        data: { nome, descricao }
      });

      return res.json(projetoAtualizado);
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao atualizar projeto' });
    }
  },

  async excluirProjeto(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ erro: 'ID inválido' });

      const removido = await prisma.projetos.delete({ where: { id } });
      return res.json({ mensagem: 'Projeto removido com sucesso', projeto: removido });
    } catch (error) {
      return res.status(500).json({ erro: 'Erro ao excluir projeto' });
    }
  }
};

module.exports = projetosController;