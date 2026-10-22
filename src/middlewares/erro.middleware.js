function tratarErros(erro, req,res, next){
    const status = erro.status || 500
    console.error('[erro]', req.method, req.url, erro.message);


    const mensagem = status === 500
    ? 'Erro intero no servidor'
    : erro. message

    res.status(status).json({ erro: { mensagem, detalhes: erro.detalhes } })
}


module.exports = tratarErros;
