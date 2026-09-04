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
    let usuarioEncontrado = null;

    // 1. Apenas valida se o usuarioId tiver sido informado (opcional)
    if (usuarioId !== undefined && usuarioId !== null) {
        usuarioEncontrado = usuarioModel.buscar(usuarioId);

        // Se informou o usuarioId mas ele NÃO existe no banco -> Erro 400
        if (!usuarioEncontrado) {
            const erro = new Error('Usuário não encontrado');
            erro.status = 400;
            throw erro;
        }
    }

    // 2. Cria a tarefa (usuarioId será o ID se existir, ou null/undefined se não foi passado)
    const nova = {
        id: proximoId++,
        texto,
        prioridade: prioridade || 'media',
        coluna: coluna || 'afazer',
        usuarioId: usuarioEncontrado ? usuarioEncontrado.id : null
    };

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
