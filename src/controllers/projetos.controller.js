let tarefas = [];

class ProjetoController {
  criarProjeto(req, res) {
    const { titulo, descricao, coluna } = req.body;

    if (!titulo) {
      return res.status(400).json({ erro: 'O título da tarefa é obrigatório.' });
    }

    const novaTarefa = {
      id: tarefas.length + 1,
      titulo,
      descricao: descricao || '',
      coluna: coluna || 'afazer',
      criadoEm: new Date()
    };

    tarefas.push(novaTarefa);
    return res.status(201).json(novaTarefa);
  }

  listarProjeto(req, res) {
    const { coluna } = req.query;

    if (coluna) {
      const filtradas = tarefas.filter(t => t.coluna === coluna);
      return res.json(filtradas);
    }

    return res.json(tarefas);
  }

  buscarPorIdProjeto(req, res) {
    const { id } = req.params;
    const tarefa = tarefas.find(t => t.id === Number(id));

    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    return res.json(tarefa);
  }

  atualizarProjeto(req, res) {
    const { id } = req.params;
    const { titulo, descricao, coluna } = req.body;

    const tarefa = tarefas.find(t => t.id === Number(id));

    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    if (titulo !== undefined) tarefa.titulo = titulo;
    if (descricao !== undefined) tarefa.descricao = descricao;
    if (coluna !== undefined) tarefa.coluna = coluna;

    return res.json(tarefa);
  }

  deletarProjeto(req, res) {
    const { id } = req.params;
    const indice = tarefas.findIndex(t => t.id === Number(id));

    if (indice === -1) {
      return res.status(404).json({ erro: 'Tarefa não encontrada.' });
    }

    tarefas.splice(indice, 1);
    return res.status(204).send();
  }

  resumoTarefasProjeto(req, res) {
    const { coluna, formato } = req.query;

    const base = coluna ? tarefas.filter(t => t.coluna === coluna) : tarefas;

    const porColuna = {
      afazer: base.filter(t => t.coluna === 'afazer').length,
      andamento: base.filter(t => t.coluna === 'andamento').length,
      concluido: base.filter(t => t.coluna === 'concluido').length,
    };

    if (formato === 'texto') {
      const textoColuna = coluna ? ` na coluna "${coluna}"` : '';
      return res.send(
        `Você tem ${base.length} tarefas${textoColuna}. ${porColuna.concluido} concluídas, ${porColuna.andamento} em andamento e ${porColuna.afazer} a fazer.`
      );
    }

    return res.json({
      total: base.length,
      filtroAplicado: coluna || 'nenhum',
      porColuna
    });
  }
}

module.exports = new ProjetoController();