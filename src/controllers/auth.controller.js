const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarios.model');

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
      }

      // Busca o utilizador no banco pelo e-mail
      const usuario = await usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      // Converte a senha digitada e a senha do banco para string
      const senhaDigitada = String(senha).trim();
      const senhaBanco = String(usuario.senha_hash || usuario.senha || '').trim();

      // Comparação direta em texto simples
      if (senhaBanco === '' || senhaBanco !== senhaDigitada) {
        return res.status(401).json({ erro: 'Credenciais inválidas.' });
      }

      // Gera o Token JWT
      const secret = process.env.JWT_SECRET || 'chave_secreta_padrao_taskflow';
      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        secret,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: { 
          id: usuario.id, 
          nome: usuario.nome, 
          email: usuario.email 
        }
      });
    } catch (error) {
      console.error('ERRO NO LOGIN:', error);
      return res.status(500).json({ erro: 'Erro interno no servidor ao realizar login.' });
    }
  }
};

module.exports = authController;