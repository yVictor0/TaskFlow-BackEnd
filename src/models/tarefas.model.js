const db = require('../database/db');

const tarefasModel = {
  async listar(usuario_id) {
    const query = `
      SELECT 
        t.*, 
        p.descricao AS prioridade_nome, 
        p.cor AS prioridade_cor,
        u.nome AS usuario_nome
      FROM tarefas t
      LEFT JOIN prioridades p ON t.prioridade_id = p.id
      LEFT JOIN usuarios u ON t.usuario_id = u.id
      WHERE t.usuario_id = $1
      ORDER BY t.ordem ASC;
    `;
    const resultado = await db.query(query, [usuario_id]);
    return resultado.rows;
  },

  async criar(dados) {
    const {
      texto,
      coluna = 'afazer',
      ordem = 0,
      usuario_id,
      prioridade_id = 1,
      projeto_id = null
    } = dados;

    const query = `
      WITH tarefa_inserida AS (
        INSERT INTO tarefas (texto, coluna, ordem, usuario_id, prioridade_id, projeto_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      )
      SELECT 
        t.*, 
        p.descricao AS prioridade_nome, 
        p.cor AS prioridade_cor,
        u.nome AS usuario_nome
      FROM tarefa_inserida t
      LEFT JOIN prioridades p ON t.prioridade_id = p.id
      LEFT JOIN usuarios u ON t.usuario_id = u.id;
    `;

    const values = [
      texto,
      coluna,
      ordem,
      usuario_id,
      prioridade_id,
      projeto_id
    ];

    const resultado = await db.query(query, values);
    return resultado.rows[0];
  },

  async atualizar(id, dados) {
    const {
      texto,
      coluna,
      ordem,
      usuario_id,
      prioridade_id,
      projeto_id,
      concluida_em
    } = dados;

    const query = `
      WITH tarefa_atualizada AS (
        UPDATE tarefas 
        SET 
          texto = COALESCE($1, texto),
          coluna = COALESCE($2, coluna),
          ordem = COALESCE($3, ordem),
          usuario_id = COALESCE($4, usuario_id),
          prioridade_id = COALESCE($5, prioridade_id),
          projeto_id = $6,
          concluida_em = $7
        WHERE id = $8
        RETURNING *
      )
      SELECT 
        t.*, 
        p.descricao AS prioridade_nome, 
        p.cor AS prioridade_cor,
        u.nome AS usuario_nome
      FROM tarefa_atualizada t
      LEFT JOIN prioridades p ON t.prioridade_id = p.id
      LEFT JOIN usuarios u ON t.usuario_id = u.id;
    `;

    const values = [
      texto !== undefined ? texto : null,
      coluna !== undefined ? coluna : null,
      ordem !== undefined ? ordem : null,
      usuario_id !== undefined ? usuario_id : null,
      prioridade_id !== undefined ? prioridade_id : null,
      projeto_id !== undefined ? projeto_id : null,
      concluida_em !== undefined ? concluida_em : null,
      id
    ];

    const resultado = await db.query(query, values);
    return resultado.rows[0];
  },

  async deletar(id) {
    const query = 'DELETE FROM tarefas WHERE id = $1 RETURNING *;';
    const resultado = await db.query(query, [id]);
    return resultado.rows[0];
  }
};

module.exports = tarefasModel;