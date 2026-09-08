const { usuariosId } = require("../controllers/usuarios.controller");
const usuarioModel = require("./usuario.model")

let tarefas = [
    {id: 1, texto: "estudar Node.js", prioridade :"alta", coluna: "andamento"},
    {id: 2, texto: "fazer ativadede", prioridade :"media", coluna: "afazer"}
]

let proximoId = 3


module.exports = {
    listar: () => tarefas,

    listarPorColuna: (coluna) => tarefas.filter(t => t.coluna === coluna),

    buscar: (id) => tarefas.find (t => t.id === id),

   adicionar: ({ texto, prioridade, coluna, usuarioId }) => {
    const usuarioEncontrado = null;
    

    if (usuarioId !== undefined && usuarioId !== null) {
        usuarioEncontrado = usuarioModel.buscar(usuarioId);
        if (!usuarioEncontrado) {
            const erro = new Error('Usuário não encontrado');
            erro.status = 400;
            throw erro;
        }
    }
    const nova = {
        id: proximoId++,
        texto,
        prioridade: prioridade || 'media',
        coluna: coluna || 'afazer',
        usuarioId: usuarioEncontrado ? usuarioEncontrado.id : null
    };
    // if(coluna !== coluna) return console.log("aa")

    tarefas.push(nova);
    return nova;
},
    atualizar: (id, dados) => { 
        const idx = tarefas.findIndex(t => t.id === id) 
        if(idx === -1) return null
        tarefas[idx] = {... tarefas[idx], ...dados, id}
        return tarefas[idx]
    },

    remover:(id) => {
        const idx = tarefas.findIndex( t => t.id === id)
        if(idx === -1) return null
        return tarefas.splice(idx, 1)[0]
    }

}
