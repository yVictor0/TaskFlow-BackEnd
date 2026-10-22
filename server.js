require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./src/database/db');

const tarefasR = require('./src/router/tarefas.routes');
const usuariosR = require('./src/router/usuarios.routes');
const projetosR = require('./src/router/projetos.routes');
const prioridadeR  = require('./src/router/prioridade.routes');
const authRouters = require('./src/router/auth.routes');

const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const autenticar = require('./src/middlewares/autenticar');
const tratarErros = require('./src/middlewares/erro.middleware');

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN, 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use(logger);
app.use(validarContentType);

app.use('/auth', authRouters);
app.use('/tarefas', autenticar, tarefasR);
app.use('/usuarios', autenticar, usuariosR);
app.use('/projetos', autenticar, projetosR);
app.use('/prioridades', autenticar, prioridadeR);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erro ao se conectar ao banco: ', err.message);
  } else {
    console.log('Banco Conectado: ', res.rows[0].now);
  }
});

app.use((req, res) => {
  const rota = `${req.method} ${req.url}`;
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota ${rota} não encontrada`
  });
});

app.use(tratarErros);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});