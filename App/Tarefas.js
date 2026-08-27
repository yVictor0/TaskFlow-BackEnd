const tarefas = []

function listarTodas(){
    return tarefas
}

function BuscarId(id){
    return tarefas.find(t=> t.id === id)
}

function adiciona(tarefa){
    tarefas.push(tarefas)
    return tarefa
}


