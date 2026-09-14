require('dotenv').config();

const express = require('express');
const tarefasR = require('./src/router/tarefas.routes');
const usuariosR = require('./src/router/usuarios.routes');
const projetosR  = require('./src/router/projetos.routes');
const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const authRouters = require('./src/router/auth.routes')
const autenticar = require('./src/middlewares/autenticar');

const cors = require('cors');
// const corsMiddleware = require('./src/middlewares/corsMiddleware')

const app = express();

app.use('/auth', authRouters)
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

app.use(logger);
app.use(validarContentType);



app.use('/tarefas', autenticar, tarefasR);
app.use('/usuarios', autenticar, usuariosR);
app.use('/projetos', autenticar, projetosR);

app.use((req, res) => {
    res.status(404).json({ erro: 'Não encontrada' });   
});

const ports = [process.env.PORTA, 3000]
ports.forEach((PORT) => {
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}` || `${process.env.PORTA}`);
    });
})