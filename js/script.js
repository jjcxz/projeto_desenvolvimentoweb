 const hoje = new Date();
    const dataAtualFormatada = hoje.toISOString().split('T')[0];
    const dataFormatadaBR = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    document.getElementById('dataAtual').textContent = dataFormatadaBR;

    let tarefas = []; 

    let tarefaEditandoId = null;

    function filtroPorPrioridades(){
      const prioridadeselecionada = document.getElementById("filtroPrioridades").value;

      if(prioridadeselecionada === ""){
        mostrarTodas()
      return;
    }
    const filtradas = tarefas.filter(t => t.prioridades === prioridadeselecionada);
    exibirTarefas(filtradas)
  }


    function exibirTarefas(lista) {
      const ul = document.getElementById("listaTarefas");
      ul.innerHTML = "";
      if (lista.length === 0) {
        ul.innerHTML = "<li>Nenhuma tarefa encontrada.</li>";
        return;
      }

      lista.forEach(tarefa => {
        const li = document.createElement("li");
        const checked = tarefa.status === "Concluída" ? "checked" : "";
        li.innerHTML = `
          <div class="tarefa-info">
            <input type="checkbox" ${checked} onchange="marcarConcluida(${tarefa.id}, this.checked)">
            <span><strong>${tarefa.nome}</strong></span>
            <span>${formatarDataBR(tarefa.data)}</span>
            <span>${tarefa.descricao}</span>
            <span></span>
            <span>${tarefa.prioridades}</span>
            <span></span>
            <span></span> 
            <span>${tarefa.status}</span>
          </div>
          <div class="acoes">
            <button style="background:#2196F3; color:white;" onclick="editarTarefa(${tarefa.id})">Editar</button>
            <button style="background:#f44336; color:white;" onclick="excluirTarefa(${tarefa.id})">Excluir</button>
          </div>
        `;
        ul.appendChild(li);
      });
    }

    function mostrarHoje() {
      const hoje = tarefas.filter(t => t.data === dataAtualFormatada && t.status !== "Concluída");
      exibirTarefas(hoje);
    }

    function mostrarTodas() {
      const ordenadas = [...tarefas].sort((a, b) => b.data.localeCompare(a.data));
      exibirTarefas(ordenadas);
    }

    function abrirModal() {
      document.getElementById("modalTarefa").style.display = "block";
      document.getElementById("inputNome").value = "";
      document.getElementById("inputData").value = dataAtualFormatada;
      document.getElementById("inputDescricao").value = "";
      document.getElementById("inputPrioridades").value = "Urgente";
      document.getElementById("inputStatus").value = "Pendente";
      document.getElementById("tituloModal").textContent = "Nova Tarefa";
      tarefaEditandoId = null;
    }

    function fecharModal() {
      document.getElementById("modalTarefa").style.display = "none";

    }

    function salvarTarefa() {
      const nome = document.getElementById("inputNome").value.trim();
      const data = document.getElementById("inputData").value;
      const descricao = document.getElementById("inputDescricao").value;
      const prioridades = document.getElementById("inputPrioridades").value;
      const status = document.getElementById("inputStatus").value;

      if (!nome || !data) {
        alert("Preencha todos os campos!");
        return;
      }

      if (tarefaEditandoId !== null) {
        const index = tarefas.findIndex(t => t.id === tarefaEditandoId);
        if (index !== -1) {
          tarefas[index].nome = nome;
          tarefas[index].data = data;
          tarefas[index].descricao = descricao;
          tarefas[index].prioridades = prioridades;
          tarefas[index].status = status;
        }

      } else {
        const novaTarefa = {
          id: Date.now(),
          nome,
          data,
          descricao,
          prioridades,
          status
        };
        tarefas.push(novaTarefa);
      }

      fecharModal();
      mostrarHoje();
    }

    function cancelarTarefa(){
      document.getElementById("modalTarefa").style.display = "none";
    }

    function editarTarefa(id) {
      const tarefa = tarefas.find(t => t.id === id);
      if (tarefa) {
        tarefaEditandoId = id;
        document.getElementById("inputNome").value = tarefa.nome;
        document.getElementById("inputData").value = tarefa.data;
        document.getElementById("inputDescricao").value = tarefa.descricao;
        document.getElementById("inputPrioridades").value = tarefa.prioridades;
        document.getElementById("inputStatus").value = tarefa.status;
        document.getElementById("tituloModal").textContent = "Editar Tarefa";
        document.getElementById("modalTarefa").style.display = "block";
      }
    }

    function excluirTarefa(id) {
      if (confirm("Deseja realmente excluir esta tarefa?")) {
        tarefas = tarefas.filter(t => t.id !== id);
        mostrarHoje();
      }
    }

    function marcarConcluida(id, concluida) {
      const tarefa = tarefas.find(t => t.id === id);
      if (tarefa) {
        tarefa.status = concluida ? "Concluída" : "Pendente";
        mostrarHoje();
      }
    }

    function formatarDataBR(dataISO) {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    document.getElementById("filtroPrioridades").addEventListener("change", filtroPorPrioridades);
    window.onload = mostrarHoje;