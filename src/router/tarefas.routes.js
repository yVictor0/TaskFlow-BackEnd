const express = require('express')
const router = express.Router()

let tarefas = []
let proximoId = 1


router.get('/', (req, res) =>{
    const { coluna } = req.query
    let resultado = tarefas
    if (coluna) resultado = tarefas.filter(t => t.coluna === coluna)
        res.json(resultado)
})

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const tarefa = tarefas.find(t => t.id === id)
    if (!tarefa) return res.status(404).json ({ erro: 'Tarefa não encontrada' }) 
    res.json(tarefa)
})

router.post('/', (req, res) => {
    const { texto, prioridade,coluna } = req.body
    if(!texto) return res.status(400).json({ erro: 'texto obrigatorio' })
        const nova = { id: proximoId++,texto,
    prioridade: prioridade || 'media', coluna: coluna || 'afazer' }
    tarefas.push(nova)
    res.status(201).json(nova)
})



router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const idx = tarefas.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' });

    tarefas[idx] = { ...tarefas[idx], ...req.body, id };
    res.json(tarefas[idx]);
});


router.delete('/', (res, req) => {
    const id = parseInt(req.params.id)
    const idx = tarefas.findIndex(t => t.id === id)

    if(idx === -1) return res.status(404).json({ erro: 'nao achei essa tarefa pae'})
    const removida = tarefas.splice(idx, 1)[0]
    res.json({mensaem: 'Tarefa removida', tarefa: removida})
})

module.exports = router;