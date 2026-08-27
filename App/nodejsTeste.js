const fs = require("fs")
const path = require("path")
const os = require("os")

console.log('=== AMBIENTE ===')
console.log('node.js', process.version)
console.log('sistema', os.platform())
console.log('pasta atual: ', __dirname)


console.log('')
console.log('=== ARQUIVOS NA PASTA ===')
const arquivos = fs.readdirSync('.')
arquivos.forEach(arquivos => {
    console.log(' -', arquivos)
})

console.log('')
console.log('=== CAMINHO DO FUTURO SERVIDOR ===')
const caminhoServidor = path.join(__dirname, 'src','server.js')
console.log('o servidor esta em: ', caminhoServidor)

const arquivosJS = arquivos.filter(a => a.endsWith('.js'))
console.log('')
console.log(`Arquivos .js encontrados: ${arquivosJS.length}`)


const arquivosTask = fs.readirSync('../TaskFlow/BackEnd')
arquivosTask.forEach(arquivo => {
    console.log(' -', arquivo)
})

const arquivosJS1 = arquivosTask.filer(a => a.endsWith('.js'))
console.log('')
console.log(`Arquivos .js encontrados: ${arquivosJS1.length}`)