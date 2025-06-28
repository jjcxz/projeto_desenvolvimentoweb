 const hoje = new Date();
    const dataAtualFormatada = hoje.toISOString().split('T')[0];
    const dataFormatadaBR = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    document.getElementById('dataAtual').textContent = dataFormatadaBR;

    let tarefaEditandoId = null;

    function obterTarefasSalvas() {
      return JSON.parse(localStorage.getItem("tarefas")) || [];
    }


    function filtroPorTipos(){
      const tarefas = obterTarefasSalvas();
      const tipoSelecionado = document.getElementById("filtroTipos").value;

      if(tipoSelecionado === ""){
        mostrarTodas()
        return;
      }
      const filtradas = tarefas.filter(t => t.tipo === tipoSelecionado);
      exibirTarefas(filtradas)
    }

    function filtroPorPrioridades(){
      const tarefas = obterTarefasSalvas();
      const prioridadeSelecionada = document.getElementById("filtroPrioridades").value;

      if(prioridadeSelecionada === ""){
        mostrarTodas()
      return;
    }
    const filtradas = tarefas.filter(t => t.prioridades === prioridadeSelecionada);
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
            <span>${tarefa.tipo}</span> 
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
      const tarefas = obterTarefasSalvas();
      const hoje = tarefas.filter(t => t.data === dataAtualFormatada && t.status !== "Concluída");
      exibirTarefas(hoje);
    }

    function mostrarTodas() {
      const tarefas = obterTarefasSalvas();
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
      const tipo = document.getElementById("inputTipo").value;

      if (!nome || !data) {
        alert("Preencha todos os campos!");
        return;
      } 
      
      const tarefas = obterTarefasSalvas();

      if (tarefaEditandoId !== null) {
        const index = tarefas.findIndex(t => t.id === tarefaEditandoId);
        if (index !== -1) {
          tarefas[index].nome = nome;
          tarefas[index].data = data;
          tarefas[index].descricao = descricao;
          tarefas[index].prioridades = prioridades;
          tarefas[index].status = status;
          tarefas[index].tipo = tipo;
        }

      } else {
        const novaTarefa = {
          id: Date.now(),
          nome,
          data,
          descricao,
          prioridades,
          status,
          tipo
        };
        
        tarefas.push(novaTarefa);
      }
        
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
        alert("Tarefa salva/editada com sucesso!");

      fecharModal();
      mostrarHoje();
      tarefaEditandoId = null;
    }

    function cancelarTarefa(){
      document.getElementById("modalTarefa").style.display = "none";
    }

    function editarTarefa(id) {
      const tarefas = obterTarefasSalvas();
      const tarefa = tarefas.find(t => t.id === id);
      if (tarefa) {
        tarefaEditandoId = id;
        document.getElementById("inputNome").value = tarefa.nome;
        document.getElementById("inputData").value = tarefa.data;
        document.getElementById("inputDescricao").value = tarefa.descricao;
        document.getElementById("inputPrioridades").value = tarefa.prioridades;
        document.getElementById("inputStatus").value = tarefa.status;
        document.getElementById("inputTipo").value = tarefa.tipo;
        document.getElementById("tituloModal").textContent = "Editar Tarefa";
        document.getElementById("modalTarefa").style.display = "block";
      }
    }

    function excluirTarefa(id) {
      if (confirm("Deseja realmente excluir esta tarefa?")) {
        const tarefas = obterTarefasSalvas().filter(t => t.id !== id);
       localStorage.setItem("tarefas", JSON.stringify(tarefas));
       mostrarHoje();
      }
    }

    function marcarConcluida(id, concluida) {
      const tarefas = obterTarefasSalvas();
      const tarefa = tarefas.find(t => t.id === id);
      if (tarefa) {
         tarefa.status = concluida ? "Concluída" : "Pendente";
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    mostrarHoje();
      }
    }

    function formatarDataBR(dataISO) {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }
    document.getElementById("filtroPrioridades").addEventListener("change", filtroPorPrioridades);
    window.onload = mostrarHoje;

    document.getElementById("filtroTipos").addEventListener("change", filtroPorTipos);
    window.onload = mostrarHoje;