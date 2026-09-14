const jwt = require('jsonwebtoken');

function autenticar(req, res, next){

    const authHeader = req.headers['authorization']
    if(!authHeader)
        return res.status(401).json({ erro: 'token naoinformado' })

    const token = authHeader.split(' ')[1]
    if(!token)
        return res.status(401)
    .json({ erro: 'Formato invalido. use: Bearer <token>' })

    try{
        const payload = jwt.verify(token, process.env.JWT_secret)
        req.usuario = payload
    }catch( erro ){
        if ( erro.erro.name === 'TokenExpiredError')
            return res.satus(401)
                .json({ erro: 'Token expirado. Faça login novamente' })
        
            return res.status(401).json({ erro: 'Token não existe' })
    }
}

module.exports= autenticar