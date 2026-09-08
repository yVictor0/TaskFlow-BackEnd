const express = require('express');
const tarefasR = require('./src/router/tarefas.routes');
const usuariosR = require('./src/router/usuarios.routes');
const projetosR  = require('./src/router/projetos.routes');
const logger = require('./src/middlewares/logger');
const validarContentType = require('./src/middlewares/validarContentType');
const app = express();

app.use(express.json());
app.use(logger);
app.use(validarContentType);

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