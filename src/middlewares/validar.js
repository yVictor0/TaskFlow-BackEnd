function validar(schema, origem = "body") {
  return function (req, res, next) {
    const dados = req[origem] || {};
    const erros = [];

    for (const campo in schema) {
      const regras = schema[campo];
      const valor = dados[campo];
      const ausente = valor === undefined || valor === null || valor === "";

      if (regras.obrigatorio && ausente) {
        erros.push(`O campo '${campo}' é obrigatório.`);
        continue;
      }

      if (ausente) continue;

      if (regras.tipo === "inteiro") {
        const numero = typeof valor === "string" ? Number(valor) : valor;
        if (!Number.isInteger(numero) || numero <= 0) {
          erros.push(`O campo '${campo}' deve ser um número inteiro positivo.`);
        }
      } 
      else if (regras.tipo && typeof valor !== regras.tipo) {
        erros.push(`O campo '${campo}' deve ser do tipo ${regras.tipo}.`);
      }
    }

    if (erros.length > 0) {
      return res.status(400).json({ mensagem: erros.join(" | "), erros });
    }

    next();
  };
}

module.exports = validar;