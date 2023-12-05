// Validação do E-mail
function validarLogin() {
    const email = document.getElementById('email-log').value;
    const senha = document.getElementById('senha-log').value;

    // Obter dados do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar se o usuário existe na base de dados
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioEncontrado) {

        // Armazenar o nome do usuário no localStorage
        localStorage.setItem('nomeUsuario', usuarioEncontrado.nome);

        // Se encontrou, redirecionar para a página principal
        window.location.href = "main.html";

    } else {
        alert("Credenciais inválidas. Por favor, tente novamente.");
    }
}

// Para atualização do Nome do Cliente no canto esquerdo da tela.
const nomeUsuario = localStorage.getItem('nomeUsuario');

document.addEventListener('DOMContentLoaded', function() {
     document.getElementById('nomeCliente').textContent = nomeUsuario;
     exibirTarefas();
});


 // Função para cadastrar um novo usuário
 function cadastrar() {
    const nome = document.getElementById('nome-cad').value;
    const email = document.getElementById('email-cad').value;
    const senha = document.getElementById('senha-cad').value;

    // Obter dados do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar se o e-mail já está cadastrado
    const usuarioExistente = usuarios.find(user => user.email === email);

    if (usuarioExistente) {
        alert("Este e-mail já está cadastrado.");
    } else {
        // Adicionar novo usuário ao array de usuários
        usuarios.push({ nome, email, senha });

        // Atualizar a base de dados no localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        alert("Usuário cadastrado com sucesso!");
    }
}

//Função para Criar as Tarefas
function criarTarefa() {
    // Coletar os valores dos campos do formulário
    const tarefa = document.getElementById('tarefa').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const dataTermino = document.getElementById('dataTermino').value;
    const horaTermino = document.getElementById('horaTermino').value;
    const descricao = document.getElementById('floatingInput').value;

    // Construir um objeto com os dados da tarefa
    const novaTarefa = {
      tarefa,
      dataInicio,
      horaInicio,
      dataTermino,
      horaTermino,
      descricao,
      status: 'Pendente' // Status padrão ao criar a tarefa
    };

    // Obter o nome do usuário atual
    const nomeUsuario = localStorage.getItem('nomeUsuario');

    // Obter dados do localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

     // Encontrar o usuário pelo nome
     const usuario = usuarios.find(user => user.nome === nomeUsuario);

    // Adicionar a nova tarefa ao usuário encontrado
    usuario.tarefas = usuario.tarefas || [];
    usuario.tarefas.push(novaTarefa);

    // Atualizar a base de dados no localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    limparCampos();

    // Chamar a função para exibir as tarefas
    exibirTarefas();
  }


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('nomeCliente').textContent = localStorage.getItem('nomeUsuario');
    exibirTarefas();

    atualizarStatusTarefas();
    setInterval(atualizarStatusTarefas, 60000);
});


// Função para Exibir as Tarefas
function exibirTarefas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(user => user.nome === nomeUsuario);
    const tarefas = usuario ? usuario.tarefas || [] : [];

    const listaTarefas = document.getElementById('listaTarefas');

    listaTarefas.innerHTML = '';

    tarefas.forEach((tarefa, index) => {
        const row = document.createElement('tr');
        const tarefaItem = document.createElement('td');
        const link = document.createElement('a');
        link.classList.add('tarefa-item');
        link.setAttribute('href', '#'); // Definir um link vazio temporariamente
        link.setAttribute('data-index', index);
        link.textContent = tarefa.tarefa;

        tarefaItem.appendChild(link);
        row.appendChild(tarefaItem);

        row.innerHTML += `
            <td>${tarefa.dataInicio} ${tarefa.horaInicio}</td>
            <td>${tarefa.dataTermino} ${tarefa.horaTermino}</td>
            <td>${tarefa.status}</td>
            <td><button type="button" class="btn btn-warning">Alterar</button></td>
        `;

        listaTarefas.appendChild(row);
    });

    // Adicionar evento de clique para os links das tarefas
    listaTarefas.addEventListener('click', (event) => {
        if (event.target.classList.contains('tarefa-item')) {
            event.preventDefault(); // Impedir o comportamento padrão do link
            const index = event.target.getAttribute('data-index');
            const descricao = tarefas[index].descricao;

            // Exibir a descrição da tarefa na tela pequena/modal
            const descricaoTarefaTexto = document.getElementById('descricaoTarefaTexto');
            descricaoTarefaTexto.textContent = descricao;

            const modal = document.getElementById('descricaoTarefaModal');
            modal.style.display = 'block';

            // Fechar o modal ao clicar no botão 'X'
            const closeBtn = document.querySelector('.close');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Fechar modeal ao clicar no Botão fechar
            const fecharModalBtn = document.getElementById('fecharModal');
            fecharModalBtn.addEventListener('click', () => {
                const modal = document.getElementById('descricaoTarefaModal');
                modal.style.display = 'none';
            });

        }
    });

    listaTarefas.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-warning')) {
            const row = event.target.closest('tr');
            const index = row.querySelector('.tarefa-item').getAttribute('data-index');
            const tarefa = tarefas[index];

            // Preencher campos do modal com os dados da tarefa selecionada
            document.getElementById('editTarefa').value = tarefa.tarefa;
            document.getElementById('editDataInicio').value = tarefa.dataInicio;
            document.getElementById('editHoraInicio').value = tarefa.horaInicio;
            document.getElementById('editDataTermino').value = tarefa.dataTermino;
            document.getElementById('editHoraTermino').value = tarefa.horaTermino;
            document.getElementById('editDescricao').value = tarefa.descricao;

            // Exibir o modal de edição
            const editarTarefaModal = document.getElementById('editarTarefaModal');
            editarTarefaModal.style.display = 'block';

            // Fechar o modal de edição ao clicar no botão "Fechar"
            const fecharEditarModalBtn = document.getElementById('fecharEditarModal');
            fecharEditarModalBtn.addEventListener('click', () => {
                editarTarefaModal.style.display = 'none';
            });

            // Lógica dos botões no modal de edição
            const alterarTarefaBtn = document.getElementById('alterarTarefa');
            const removerTarefaBtn = document.getElementById('removerTarefa');
            const marcarRealizadaBtn = document.getElementById('marcarRealizada');

            // Obter o status atual da tarefa
            const statusTarefa = tarefas[index].status;
            
            // Configurar o texto do botão no modal de acordo com o status da tarefa
            if (statusTarefa === 'Realizada') {
                marcarRealizadaBtn.textContent = 'Marcar como Não Realizada';
            } else {
                marcarRealizadaBtn.textContent = 'Marcar como Realizada';
            }

            setInterval(atualizarStatusTarefas, 60000);

            alterarTarefaBtn.addEventListener('click', () => {
                // Obter os novos valores dos campos do formulário de edição
                const editTarefa = document.getElementById('editTarefa').value;
                const editDataInicio = document.getElementById('editDataInicio').value;
                const editHoraInicio = document.getElementById('editHoraInicio').value;
                const editDataTermino = document.getElementById('editDataTermino').value;
                const editHoraTermino = document.getElementById('editHoraTermino').value;
                const editDescricao = document.getElementById('editDescricao').value;


                // Atualizar os valores da tarefa com os novos valores
                tarefas[index].tarefa = editTarefa;
                tarefas[index].dataInicio = editDataInicio;
                tarefas[index].horaInicio = editHoraInicio;
                tarefas[index].dataTermino = editDataTermino;
                tarefas[index].horaTermino = editHoraTermino;
                tarefas[index].descricao = editDescricao;


                // Atualizar os dados no localStorage
                const nomeUsuario = localStorage.getItem('nomeUsuario');
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuario = usuarios.find(user => user.nome === nomeUsuario);
                usuario.tarefas = tarefas;

                // Atualizar a base de dados no localStorage
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Fechar o modal de edição após a atualização
                editarTarefaModal.style.display = 'none';

                // Atualizar a visualização das tarefas na interface
                exibirTarefas();
                atualizarStatusTarefas();

            });


            removerTarefaBtn.addEventListener('click', () => {
                // Remover a tarefa da lista de tarefas
                tarefas.splice(index, 1);

                // Atualizar os dados no localStorage
                const nomeUsuario = localStorage.getItem('nomeUsuario');
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuario = usuarios.find(user => user.nome === nomeUsuario);
                usuario.tarefas = tarefas;

                // Atualizar a base de dados no localStorage
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Fechar o modal de edição após a remoção
                editarTarefaModal.style.display = 'none';

                // Atualizar a visualização das tarefas na interface
                exibirTarefas();
            });


            marcarRealizadaBtn.addEventListener('click', (event) => {

                event.preventDefault(); // Prevenir comportamento padrão do botão

                // Verificar o status da tarefa ao clicar no botão
                if (tarefas[index].status === 'Realizada') {
                    // Alterar o status para "Não Realizada" e chamar a função de atualização
                    tarefas[index].status = 'Pendente'; // Ou outra lógica desejada
                } else {
                    // Alterar o status para "Realizada" e chamar a função de atualização
                    tarefas[index].status = 'Realizada';
                }


                // Atualizar os dados no localStorage e a interface
                const nomeUsuario = localStorage.getItem('nomeUsuario');
                const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
                const usuario = usuarios.find(user => user.nome === nomeUsuario);
                usuario.tarefas = tarefas;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));

                // Fechar o modal de edição após a atualização
                editarTarefaModal.style.display = 'none';

                // Atualizar a visualização das tarefas na interface
                exibirTarefas();
                atualizarStatusTarefas();

            }); 
        }
    });

}

function limparCampos() {
    // Limpar os campos do formulário
    document.getElementById('tarefa').value = '';
    document.getElementById('dataInicio').value = '';
    document.getElementById('horaInicio').value = '';
    document.getElementById('dataTermino').value = '';
    document.getElementById('horaTermino').value = '';
    document.getElementById('floatingInput').value = '';
}

// Função para atualizar o status das tarefas
function atualizarStatusTarefas() {
    const nomeUsuario = localStorage.getItem('nomeUsuario');
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(user => user.nome === nomeUsuario);
    const tarefas = usuario ? usuario.tarefas || [] : [];

    const dataAtual = new Date();

    tarefas.forEach((tarefa) => {
        const dataInicio = new Date(`${tarefa.dataInicio}T${tarefa.horaInicio}`);
        const dataTermino = new Date(`${tarefa.dataTermino}T${tarefa.horaTermino}`);

        if (tarefa.status !== 'Realizada') {
            if (
                (dataAtual > dataInicio || (dataAtual.toISOString().slice(0, 16) === dataInicio.toISOString().slice(0, 16))) &&
                (dataAtual < dataTermino || (dataAtual.toISOString().slice(0, 16) === dataTermino.toISOString().slice(0, 16)))
            ) {
                tarefa.status = 'Em andamento';
            } else if (dataAtual < dataInicio) {
                tarefa.status = 'Pendente';
            } else if (dataAtual > dataTermino) {
                tarefa.status = 'Em atraso';
            }
        }
    });

    // Atualizar os dados no localStorage
    usuario.tarefas = tarefas;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    // Atualizar a visualização das tarefas na interface
    exibirTarefas();
}

// Função para validação e chamada da função criar.
function validarEAdicionarTarefa() {
    const tarefa = document.getElementById('tarefa').value;
    const dataInicio = document.getElementById('dataInicio').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const dataTermino = document.getElementById('dataTermino').value;
    const horaTermino = document.getElementById('horaTermino').value;
    const descricao = document.getElementById('floatingInput').value;

    // Verifica se todos os campos estão preenchidos
    if (tarefa && dataInicio && horaInicio && dataTermino && horaTermino && descricao) {
        // Se todos os campos estiverem preenchidos, chama a função criarTarefa()
        criarTarefa();
    } else {
        alert('Por favor, preencha todos os campos para criar uma nova tarefa.');
    }
}