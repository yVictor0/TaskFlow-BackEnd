// function corsMiddleware(req, res, next){

//     res.setHeader('Access-control-Allow-Origin', 'https://www.google.com') 
//     // localhost:5173  
//     res.setHeader('Access-control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
//     res.setHeader('Access-control-Allow-Headers', 'Content-Type, Authorization')
//     res.setHeader('Access-control-Allow-Max-Age', '86400')

//     if(req.method === 'OPTIONS'){
//         return res.sendStatus(200)
//     }
//     next()
    
// }

// module.exports = corsMiddleware;