const pool = require("../database/db");

module.exports = {
  listar: async () => {
    const result = await pool.query("SELECT * FROM tarefas ORDER BY id ASC");
    return result.rows;
  },

  listarPorUsuario: async (usuario_id) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY ordem ASC, id ASC",
      [usuario_id]
    );
    return result.rows;
  },

  buscar: async (id) => {
    const result = await pool.query("SELECT * FROM tarefas WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  adicionar: async ({ texto, coluna, ordem, usuario_id, projeto_id, prioridade_id }) => {
    const query = `
      INSERT INTO tarefas (texto, coluna, ordem, usuario_id, projeto_id, prioridade_id) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *;
    `;
    const values = [
      texto,
      coluna || "A Fazer",
      ordem || 1,
      usuario_id,
      projeto_id,
      prioridade_id || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const { texto, coluna, ordem, projeto_id, prioridade_id, concluida_em } = dados;

    const sql = `
      UPDATE tarefas 
      SET texto = COALESCE($1, texto),
          coluna = COALESCE($2, coluna),
          ordem = COALESCE($3, ordem),
          projeto_id = COALESCE($4, projeto_id),
          prioridade_id = COALESCE($5, prioridade_id),
          concluida_em = COALESCE($6, concluida_em)
      WHERE id = $7
      RETURNING *;
    `;

    const valores = [
      texto || null,
      coluna || null,
      ordem || null,
      projeto_id || null,
      prioridade_id || null,
      concluida_em || null,
      id
    ];

    const result = await pool.query(sql, valores);
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const result = await pool.query("DELETE FROM tarefas WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
  }
};