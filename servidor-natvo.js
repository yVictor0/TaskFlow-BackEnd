const http = require('http')
const tarefas = [{ id:1, texto:'estudar', coluna:'afazer'},]

const servidor =http.createServer((req, res ) =>{
    if (req.url === '/tarefas' && req.method === 'GET'){
        res.writeHead(200, {'Content-TYpe': 'application/json'})
        
        res.end(JSON.stringify(tarefas))
    }else if(req.rl === '/' && req.method === 'GET'){
         res.writeHead(200, {'Content-TYpe': 'application/json'})
        res.end(JSON.stringify({status: 'ok'}))
    }else{
         res.writeHead(404, {'Content-TYpe': 'application/json'})
        res.end(JSON.stringify({erro: 'essa rota nfoicriada'}))
    }
})


servidor.listen(3000, ()=> {
    console.log('SERVIDOR RODANDO EM -> http://localhost:3000')
})