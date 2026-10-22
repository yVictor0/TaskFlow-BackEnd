function TratarErros(err, req, res, next) {
    console.error('Erro capturado:', err.stack || err.message);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        sucesso: false,
        mensagem: err.message || 'Ocorreu um erro interno no servidor.'
    });
}

module.exports = TratarErros;