const pool = require("../database/db");

module.exports = {
  // Lista apenas as tarefas do usuário informado
  listarPorUsuario: async (usuario_id) => {
    const result = await pool.query(
      "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY ordem ASC, id ASC",
      [usuario_id]
    );
    return result.rows;
  },

  // Busca uma tarefa específica garantindo que pertence ao usuário
  buscar: async (id, usuario_id = null) => {
    if (usuario_id) {
      const result = await pool.query(
        "SELECT * FROM tarefas WHERE id = $1 AND usuario_id = $2",
        [id, usuario_id]
      );
      return result.rows[0] || null;
    }

    const result = await pool.query("SELECT * FROM tarefas WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  // Cria uma nova tarefa associada ao usuário
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
      projeto_id || null,
      prioridade_id || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Atualiza a tarefa verificando a propriedade do usuário (opcional)
  atualizar: async (id, dados, usuario_id = null) => {
    const { texto, coluna, ordem, projeto_id, prioridade_id, concluida_em } = dados;

    let sql = `
      UPDATE tarefas 
      SET texto = COALESCE($1, texto),
          coluna = COALESCE($2, coluna),
          ordem = COALESCE($3, ordem),
          projeto_id = COALESCE($4, projeto_id),
          prioridade_id = COALESCE($5, prioridade_id),
          conclida_em = COALESCE($6, concluida_em)
      WHERE id = $7
    `;

    const valores = [
      texto || null,
      coluna || null,
      ordem || null,
      projeto_id || null,
      prioridade_id || null,
      conclida_em || null,
      id
    ];

    if (usuario_id) {
      sql += ` AND usuario_id = $8`;
      valores.push(usuario_id);
    }

    sql += ` RETURNING *;`;

    const result = await pool.query(sql, valores);
    return result.rows[0] || null;
  },

  // Remove apenas se a tarefa pertencer ao usuário
  remover: async (id, usuario_id = null) => {
    if (usuario_id) {
      const result = await pool.query(
        "DELETE FROM tarefas WHERE id = $1 AND usuario_id = $2 RETURNING *",
        [id, usuario_id]
      );
      return result.rows[0] || null;
    }

    const result = await pool.query("DELETE FROM tarefas WHERE id = $1 RETURNING *", [id]);
    return result.rows[0] || null;
  },

  // Mantido apenas para consultas administrativas globais, se necessário
  listarTodas: async () => {
    const result = await pool.query("SELECT * FROM tarefas ORDER BY id ASC");
    return result.rows;
  }
};