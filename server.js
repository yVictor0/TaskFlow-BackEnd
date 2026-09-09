const express = require('express');
const tarefasR = require('./src/router/tarefas.routes');
const usuariosR = require('./src/router/usuarios.routes');
const projetosR  = require('./src/router/projetos.routes');
const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
// const corsMiddleware = require('./src/middlewares/corsMiddleware')

const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cors)
app.use(express.json());
app.use(logger);
app.use(validarContentType);
// app.use(corsMiddleware)

app.use('/tarefas', tarefasR);
app.use('/usuarios', usuariosR);
app.use('/projetos', projetosR);

app.use((req, res) => {
    res.status(404).json({ erro: 'Não encontrada' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});