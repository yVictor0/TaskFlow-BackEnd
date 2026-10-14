const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarios.model');

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
      }

      // 1. Busca o usuário no banco de dados
      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // 2. Valida a senha comparando com a coluna 'senha_hash' do banco
      const senhaValida = (usuario.senha_hash && usuario.senha_hash === senha) || (usuario.senha && usuario.senha === senha);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // 3. Gera o Token JWT
      const secret = process.env.JWT_SECRET || 'secret_key_padrao';
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        secret,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }
      });
    } catch (error) {
      console.error('Erro no login:', error);
      return res.status(500).json({ erro: 'Erro interno no servidor ao realizar login' });
    }
  }
};

module.exports = authController;