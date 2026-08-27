const express = require('express')
const app = express()
const PORTA = 3000

const frames = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
let i = 0
let proximaId = 4  

const tarefas = [

{ id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },

{ id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },

{ id: 3, texto: 'Testar Postman',prioridade: 'media', coluna: 'concluido' },

];


const girando = () => {
    process.stdout.write(`\r${frames[i]}`) /*precisa ter o \r se n fica repetindo a string em `` e n vai sobreescrever o texto anterior*/
    i = (i+1)% frames.length
}

app.use(express.json())

app.get('/ok', (req, res) =>{
    res.json({status: 'ok', dados: ['1','2','3']})
})


app.get('/erro', (req, res) =>{
    res.status(400).json({erro: 'Dados invalidos'})
})


app.get('/criado', (req, res) =>{
    res.status(201).json({mensagem: 'Criado om sucesso'})
})

app.get('/texto', (req, res) =>{
    res.send('Resposta em texto simples');
})


app.get('/', (req, res) =>{
    res.json({api: 'TaskFlow', versao: '1.0', status: 'online'});
})

// app.get('/tarefas', (req, res) =>{
//     res.json(tarefas);
// })

app.get('/tarefas/:id', (req, res) =>{

    const id = Number(req.params.id)
    const tarefa = tarefas.find(t => t.id === id)
    if(!tarefa){
        return res.status(404).json({erro:'nao achei essa tarefa pai'})
    }
    res.json(tarefa);
})

//filtro p achar apenas coisas especifica
app.get('/tarefas', (req, res) =>{

    const {coluna, prioridade} = req.query
    let resultado = tarefas
    if(coluna){
        resultado = resultado.filter(t => t.coluna === coluna)
    }

    if(prioridade){
        resultado = resultado.filter(t =>t.prioridade === prioridade)
    }
    res.json(resultado);
})  



app.post('/tarefas', (req, res) => {
    const { texto, prioridade, coluna, cidade } = req.body
    const novaTarefa ={
        id: proximaId++,
        texto: texto,
        prioridade: prioridade || 'media',  
        coluna: coluna || 'afazer',
        cidade: cidade || '',
    }
tarefas.push(novaTarefa)
res.status(201).json(novaTarefa)
})
 

app.put('/tarefas/:id', (req, res) => {
   

    const id = Number(req.params.id)

    const  { texto, prioridade, coluna, cidade } = req.body || {}

    const indice = tarefas.findIndex(t => t.id === id)
       
    if (indice === -1){
      
        return res.status(404).json({ erro: 'não foi possivel acahr essa tarefa'})
    }
  
    const tarefasAtualizada = { id, texto, prioridade, coluna, cidade }
    tarefas[indice] = tarefasAtualizada

    res.json(tarefasAtualizada)
    
})



app.delete('/tarefas/:id', (req, res) => {
    console.log('pass ✅')
    const id = Number(req.params.id)

    const index = tarefas.findIndex(t => t.id === id)

    if (index === -1) {
        return res.status(404).json({ erro: 'essa tarefa nao existe' })
    }
    tarefas.splice(index, 1)

    res.json({ menssagem: 'Tarefa Deletada Com Sucesso', id })
})


app.use((req,res)=>{
    res.status(404).json({
        erro: 'EI PAI, TEM ESSA ROTA N VISSE',
        metodo:req.method,
        caminho: req.url
    })
})




app.listen(PORTA, (req, res)=>{
    console.log(`Server Rodando em http://localhost:${PORTA}` + setInterval(girando, 100))
})

const express = require('express')
const app = express()
const PORTA = 3000

const frames = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
let i = 0
let proximaId = 4  

const tarefas = [

{ id: 1, texto: 'Estudar Node', prioridade: 'alta', coluna: 'afazer' },

{ id: 2, texto: 'Criar API', prioridade: 'alta', coluna: 'andamento' },

{ id: 3, texto: 'Testar Postman',prioridade: 'media', coluna: 'concluido' },

];


const girando = () => {
    process.stdout.write(`\r${frames[i]}`) /*precisa ter o \r se n fica repetindo a string em `` e n vai sobreescrever o texto anterior*/
    i = (i+1)% frames.length
}

app.use(express.json())

app.get('/ok', (req, res) =>{
    res.json({status: 'ok', dados: ['1','2','3']})
})


app.get('/erro', (req, res) =>{
    res.status(400).json({erro: 'Dados invalidos'})
})


app.get('/criado', (req, res) =>{
    res.status(201).json({mensagem: 'Criado om sucesso'})
})

app.get('/texto', (req, res) =>{
    res.send('Resposta em texto simples');
})


app.get('/', (req, res) =>{
    res.json({api: 'TaskFlow', versao: '1.0', status: 'online'});
})

// app.get('/tarefas', (req, res) =>{
//     res.json(tarefas);
// })

app.get('/tarefas/:id', (req, res) =>{

    const id = Number(req.params.id)
    const tarefa = tarefas.find(t => t.id === id)
    if(!tarefa){
        return res.status(404).json({erro:'nao achei essa tarefa pai'})
    }
    res.json(tarefa);
})

//filtro p achar apenas coisas especifica
app.get('/tarefas', (req, res) =>{

    const {coluna, prioridade} = req.query
    let resultado = tarefas
    if(coluna){
        resultado = resultado.filter(t => t.coluna === coluna)
    }

    if(prioridade){
        resultado = resultado.filter(t =>t.prioridade === prioridade)
    }
    res.json(resultado);
})  



app.post('/tarefas', (req, res) => {
    const { texto, prioridade, coluna, cidade } = req.body
    const novaTarefa ={
        id: proximaId++,
        texto: texto,
        prioridade: prioridade || 'media',  
        coluna: coluna || 'afazer',
        cidade: cidade || '',
    }
tarefas.push(novaTarefa)
res.status(201).json(novaTarefa)
})
 

app.put('/tarefas/:id', (req, res) => {
   

    const id = Number(req.params.id)

    const  { texto, prioridade, coluna, cidade } = req.body || {}

    const indice = tarefas.findIndex(t => t.id === id)
       
    if (indice === -1){
      
        return res.status(404).json({ erro: 'não foi possivel acahr essa tarefa'})
    }
  
    const tarefasAtualizada = { id, texto, prioridade, coluna, cidade }
    tarefas[indice] = tarefasAtualizada

    res.json(tarefasAtualizada)
    
})



app.delete('/tarefas/:id', (req, res) => {
    console.log('pass ✅')
    const id = Number(req.params.id)

    const index = tarefas.findIndex(t => t.id === id)

    if (index === -1) {
        return res.status(404).json({ erro: 'essa tarefa nao existe' })
    }
    tarefas.splice(index, 1)

    res.json({ menssagem: 'Tarefa Deletada Com Sucesso', id })
})


app.use((req,res)=>{
    res.status(404).json({
        erro: 'EI PAI, TEM ESSA ROTA N VISSE',
        metodo:req.method,
        caminho: req.url
    })
})




app.listen(PORTA, (req, res)=>{
    console.log(`Server Rodando em http://localhost:${PORTA}` + setInterval(girando, 100))
})

