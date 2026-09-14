require('dotenv').config();

const express = require('express');
const cors = require('cors');

const tarefasR = require('./src/router/tarefas.routes');
const usuariosR = require('./src/router/usuarios.routes');
const projetosR  = require('./src/router/projetos.routes');
const authRouters = require('./src/router/auth.routes');

const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const autenticar = require('./src/middlewares/autenticar');

const app = express();

// 1. MIDDLEWARES GLOBAIS (Devem vir antes de TODAS as rotas)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// OBRIGATÓRIO: Converte o body JSON para req.body
app.use(express.json());

app.use(logger);
app.use(validarContentType);

// 2. ROTAS PÚBLICAS (Sem autenticação)
app.use('/auth', authRouters);

// 3. ROTAS PROTEGIDAS (Com middleware de autenticação)
app.use('/tarefas', autenticar, tarefasR);
app.use('/usuarios', autenticar, usuariosR);
app.use('/projetos', autenticar, projetosR);

// 4. TRATAMENTO DE ROTA NÃO ENCONTRADA (404)
app.use((req, res) => {
    res.status(404).json({ erro: 'Não encontrada' });   
});

// 5. INICIALIZAÇÃO DO SERVIDOR
// Use apenas uma porta principal para evitar subir duas instâncias da mesma aplicação
const PORT = process.env.PORTA || 3001;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});