const pool = require("../database/db");

module.exports = {
  listar: async () => {
    const result = await pool.query("SELECT id, nome, email, criado_em FROM usuarios ORDER BY id ASC");
    return result.rows;
  },

  buscar: async (id) => {
    const result = await pool.query(
      "SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1", 
      [id]
    );
    return result.rows[0] || null;
  },

  buscarPorEmail: async (email) => {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1", 
      [email]
    );
    return result.rows[0] || null;
  },

  adicionar: async ({ nome, email, senha }) => {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email, criado_em",
      [nome, email, senha]
    );
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const keys = Object.keys(dados);
    if (keys.length === 0) return null;

    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");
    const values = [...Object.values(dados), id];

    const query = `
      UPDATE usuarios 
      SET ${setClause} 
      WHERE id = $${keys.length + 1} 
      RETURNING id, nome, email, criado_em;
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email", 
      [id]
    );
    return result.rows[0] || null;
  }
};