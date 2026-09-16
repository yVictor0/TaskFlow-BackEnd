let usuarios = [

{ id: 1, nome: 'Ana', email: 'ana@email.com', senha: '123456' },
{ id: 2, nome: 'Bruno', email: 'yan@gmail.com', senha: '123' },
{ id: 3, nome: 'Alice', email: 'alice@email.com', senha: '123456' },
];

let proximoId = 4;

module.exports = {

    listar: () => usuarios,

    buscar: (id) => usuarios.find(u => u.id === id),

    buscarPorEmail: (email) => usuarios.find(u => u.email === email),

    adicionar: ({ nome, email }) => {
        const novo = { id: proximoId++, nome, email }
        usuarios.push(novo)
        return novo
    },

    atualizar: (id, dados) => {
        const idx = usuarios.findIndex(u => u.id === id)
        if (idx === -1) return null
        usuarios[idx] = { ...usuarios[idx], ...dados, id }
        return usuarios[idx]
    },

    remover: (id) => {
        const idx = usuarios.findIndex(u => u.id === id)
        if (idx === -1) return null
        return usuarios.splice(idx, 1)[0]

    },

}