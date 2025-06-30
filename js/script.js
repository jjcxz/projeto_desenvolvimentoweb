 const hoje = new Date();
    const dataAtualFormatada = hoje.toISOString().split('T')[0];
    const dataFormatadaBR = hoje.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    document.getElementById('dataAtual').textContent = dataFormatadaBR;

    let tarefaEditandoId = null;

    function obterTarefasSalvas() {
      return JSON.parse(localStorage.getItem("tarefas")) || [];
    }


function aplicarFiltros() {
  const tarefas = obterTarefasSalvas();
  const tipoSelecionado = document.getElementById("filtroTipos").value;
  const prioridadeSelecionada = document.getElementById("filtroPrioridades").value;

  let filtradas = tarefas;

  if (tipoSelecionado !== "") {
    filtradas = filtradas.filter(t => t.tipo === tipoSelecionado);
  }

  if (prioridadeSelecionada !== "") {
    filtradas = filtradas.filter(t => t.prioridades === prioridadeSelecionada);
  }

  exibirTarefas(filtradas);
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
    const checked = tarefa.concluida ? "checked" : "";
    li.innerHTML = `
      <div class="tarefa-info">
        <input type="checkbox" ${checked} onchange="marcarConcluida(${tarefa.id}, this.checked)">
        <span><strong>${tarefa.nome}</strong></span>
        <span>${formatarDataBR(tarefa.data)}</span>
        <span>${tarefa.descricao}</span>
        <span>${tarefa.prioridades}</span>
        <span>${tarefa.tipo}</span> 
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
      resetarFiltrosVisuais();
      
      const tarefas = obterTarefasSalvas();
const hoje = tarefas.filter(t => t.data === dataAtualFormatada && !t.concluida);
      exibirTarefas(hoje);
    }


function mostrarTodas() {
  resetarFiltrosVisuais();
  const tarefas = obterTarefasSalvas();
  const naoConcluidas = tarefas.filter(t => !t.concluida); // só tarefas NÃO concluídas
  exibirTarefas(naoConcluidas);
}

 

    function abrirModal() {
      document.getElementById("modalTarefa").style.display = "block";
      document.getElementById("inputNome").value = "";
      document.getElementById("inputData").value = dataAtualFormatada;
      document.getElementById("inputDescricao").value = "";
      document.getElementById("inputPrioridades").value = "Urgente";
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
      const tipo = document.getElementById("inputTipo").value;
      const concluida = false;

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
          tarefas[index].tipo = tipo;
        }

      } else {
        const novaTarefa = {
          id: Date.now(),
          nome,
          data,
          descricao,
          prioridades,
          tipo
        };
        
        tarefas.push(novaTarefa);
      }
        
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
        alert("Tarefa salva/editada com sucesso!");

      fecharModal();

      const pagina = window.location.pathname;
      if (pagina.includes("hoje.html")) {
        mostrarHoje();
      } else {
        mostrarTodas();
      }

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
function mostrarConcluidas() {
  resetarFiltrosVisuais();

  const tarefas = obterTarefasSalvas();
  const concluidas = tarefas.filter(t => t.concluida === true);
  exibirTarefas(concluidas);
}


function exibirTarefasConcluidas() {
  const tarefas = obterTarefasSalvas();
  const lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";

  const tarefasConcluidas = tarefas.filter(t => t.concluida === true);

  tarefasConcluidas.forEach(tarefa => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      marcarConcluida(tarefa.id, checkbox.checked);
    });

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(` ${tarefa.nome} - ${tarefa.descricao}`));
    lista.appendChild(li);
  });
}

function marcarConcluida(id, estaConcluida) {
  const tarefas = obterTarefasSalvas();
  const tarefa = tarefas.find(t => t.id === id);
  if (tarefa) {
    tarefa.concluida = estaConcluida;
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    const pagina = window.location.pathname;
    if (pagina.includes("hoje.html")) {
      mostrarHoje();
    } else if (pagina.includes("concluidas.html")) {
      mostrarConcluidas();
    } else {
      mostrarTodas();
    }
  }
}


 
    function formatarDataBR(dataISO) {
      const data = new Date(dataISO);
      return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    }

function resetarFiltrosVisuais() {
  const filtroTipos = document.getElementById("filtroTipos");
  const filtroPrioridades = document.getElementById("filtroPrioridades");

  if (filtroTipos) filtroTipos.value = "";
  if (filtroPrioridades) filtroPrioridades.value = "";
}

  window.onload = function () {
  const pagina = window.location.pathname;

  if (pagina.includes("hoje.html")) {
    mostrarHoje();
  } else if (pagina.includes("todas.html")) {
    mostrarTodas();
  } else if (pagina.includes("concluidas.html")) {
    mostrarConcluidas();
  }

  resetarFiltrosVisuais();

  const filtroPrioridades = document.getElementById("filtroPrioridades");
  const filtroTipos = document.getElementById("filtroTipos");

  if (filtroPrioridades) filtroPrioridades.addEventListener("change", aplicarFiltros);
  if (filtroTipos) filtroTipos.addEventListener("change", aplicarFiltros);
};

