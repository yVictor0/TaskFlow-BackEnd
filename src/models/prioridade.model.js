const db = require('../database/db');

const prioridadeModel = {
  async listar() {
    const resultado = await db.query('SELECT id, descricao FROM prioridades ORDER BY id ASC;');
    return resultado.rows;
  },

  


};

module.exports = prioridadeModel;