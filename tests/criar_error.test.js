const criar_erro = require('../src/utils/criar_erro')

describe('criar_erro', () =>{
    test('devolve um Error com o satus e a mensagem', () => {
        const erro = criar_erro(404, 'tarefa não encontrada')

        expect(erro).toBeInstance(Error)
        expect(erro.status).toBe(404)
        expect(erro.menssage).toBe('tarefa não encontrada')
    })
})