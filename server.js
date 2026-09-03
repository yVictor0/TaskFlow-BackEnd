const express = require('express');
const tarefasR = require('./src/router/tarefas.routes');
const usuariosR = require('./src/router/usuarios.routes');
const projetosR  = require('./src/router/projetos.routes');
const app = express();

app.use(express.json());

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