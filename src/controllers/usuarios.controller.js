const usuarioModel = require('../models/usuarios.model');

const usuariosController = {
  async listarUsuarios(req, res) {
    try {
      const usuarios = await usuarioModel.listar();
      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ erro: 'Erro interno no servidor ao listar usuários' });
    }
  },

  async usuariosId(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const usuario = await usuarioModel.buscar(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      res.status(500).json({ erro: 'Erro interno no servidor' });
    }
  },

  async adicionarNovoUsuario(req, res) {
    try {
      const { nome, email, senha } = req.body;

      if (!nome) return res.status(400).json({ erro: 'O nome é obrigatório' });
      if (!email) return res.status(400).json({ erro: 'O e-mail é obrigatório' });
      if (!senha) return res.status(400).json({ erro: 'A senha é obrigatória' });

      // Verifica se o e-mail já está cadastrado
      const usuarioExistente = await usuarioModel.buscarPorEmail(email);
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'Este e-mail já está em uso' });
      }

      const novoUsuario = await usuarioModel.adicionar({ nome, email, senha });
      res.status(201).json(novoUsuario);
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      res.status(500).json({ erro: 'Erro interno no servidor ao cadastrar usuário' });
    }
  },

  async atualizarUsuario(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const usuarioExistente = await usuarioModel.buscar(id);
      if (!usuarioExistente) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const usuarioAtualizado = await usuarioModel.atualizar(id, req.body);
      res.json(usuarioAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ erro: 'Erro interno no servidor ao atualizar usuário' });
    }
  },

  async excluirUsuario(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID inválido' });
      }

      const usuarioExistente = await usuarioModel.buscar(id);
      if (!usuarioExistente) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
      }

      const removido = await usuarioModel.remover(id);
      res.json({ mensagem: 'Usuário removido com sucesso', usuario: removido });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ erro: 'Erro interno no servidor ao excluir usuário' });
    }
  }
};

module.exports = usuariosController;