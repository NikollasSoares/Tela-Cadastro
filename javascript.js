function formatarCPF(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);

    if (v.length > 9)      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2');

    input.value = v;
}

function cpfSomenteNumeros(cpf) {
    return cpf.replace(/\D/g, '');
}

// ─── ARMAZENAMENTO DE USUÁRIOS (localStorage) ──────────────────────────────

function getUsuarios() {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
}

function salvarUsuarios(lista) {
    localStorage.setItem('usuarios', JSON.stringify(lista));
}

// ─── CADASTRO ──────────────────────────────────────────────────────────────

function cadastrar() {
    const cpf       = cpfSomenteNumeros(document.getElementById('cpf').value);
    const firstName = document.getElementById('firstname').value.trim();
    const lastName  = document.getElementById('lastname').value.trim();
    const password  = document.getElementById('password').value;
    const confirm   = document.getElementById('confirm-password').value;

    if (!cpf || !firstName || !lastName || !password || !confirm) {
        mostrarFeedback('Por favor, preencha todos os campos.', 'erro');
        return;
    }
    if (cpf.length !== 11) {
        mostrarFeedback('CPF inválido. Digite os 11 dígitos.', 'erro');
        return;
    }
    if (password !== confirm) {
        mostrarFeedback('As senhas não coincidem.', 'erro');
        return;
    }
    if (password.length < 6) {
        mostrarFeedback('A senha deve ter pelo menos 6 caracteres.', 'erro');
        return;
    }

    const usuarios = getUsuarios();

    if (usuarios.find(u => u.cpf === cpf)) {
        mostrarFeedback('Este CPF já está cadastrado.', 'erro');
        return;
    }

    const novoUsuario = { cpf, firstName, lastName, password };
    usuarios.push(novoUsuario);
    salvarUsuarios(usuarios);

    mostrarFeedback(`Cadastro realizado! Bem-vindo, ${firstName}!`, 'sucesso');
    setTimeout(() => { window.location.href = 'telaLogin.html'; }, 1800);
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────

function login() {
    const cpf      = cpfSomenteNumeros(document.getElementById('cpf').value);
    const password = document.getElementById('password').value;

    if (!cpf || !password) {
        mostrarFeedback('Preencha CPF e senha.', 'erro');
        return;
    }

    const usuarios = getUsuarios();
    const usuario  = usuarios.find(u => u.cpf === cpf && u.password === password);

    if (usuario) {
        // Salva sessão simples (sem expiração — suficiente para projeto sem BD)
        sessionStorage.setItem('usuarioLogado', JSON.stringify({
            cpf: usuario.cpf,
            firstName: usuario.firstName,
            lastName: usuario.lastName
        }));
        mostrarFeedback(`Bem-vindo de volta, ${usuario.firstName}!`, 'sucesso');
        setTimeout(() => { window.location.href = '../index.html'; }, 1500);
    } else {
        mostrarFeedback('CPF ou senha incorretos.', 'erro');
    }
}

// ─── GERENCIAR USUÁRIOS (CRUD) ─────────────────────────────────────────────

function renderizarTabela() {
    const tbody    = document.getElementById('tabela-usuarios');
    const vazio    = document.getElementById('estado-vazio');
    const usuarios = getUsuarios();

    tbody.innerHTML = '';

    if (usuarios.length === 0) {
        vazio.style.display = 'flex';
        return;
    }

    vazio.style.display = 'none';

    usuarios.forEach((u, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${formatarCPFTexto(u.cpf)}</td>
            <td>${u.firstName} ${u.lastName}</td>
            <td>
                <button class="btn-acao btn-editar" onclick="abrirEdicao(${index})">Editar</button>
                <button class="btn-acao btn-excluir" onclick="excluirUsuario(${index})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function formatarCPFTexto(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function abrirEdicao(index) {
    const usuarios = getUsuarios();
    const u = usuarios[index];

    document.getElementById('edit-index').value    = index;
    document.getElementById('edit-cpf').value      = formatarCPFTexto(u.cpf);
    document.getElementById('edit-firstname').value = u.firstName;
    document.getElementById('edit-lastname').value  = u.lastName;
    document.getElementById('edit-password').value  = '';

    document.getElementById('modal-edicao').style.display = 'flex';
}

function fecharEdicao() {
    document.getElementById('modal-edicao').style.display = 'none';
}

function salvarEdicao() {
    const index     = parseInt(document.getElementById('edit-index').value);
    const firstName = document.getElementById('edit-firstname').value.trim();
    const lastName  = document.getElementById('edit-lastname').value.trim();
    const password  = document.getElementById('edit-password').value;

    if (!firstName || !lastName) {
        mostrarFeedback('Nome e sobrenome são obrigatórios.', 'erro');
        return;
    }

    const usuarios = getUsuarios();
    usuarios[index].firstName = firstName;
    usuarios[index].lastName  = lastName;
    if (password.length >= 6) {
        usuarios[index].password = password;
    } else if (password.length > 0) {
        mostrarFeedback('Nova senha deve ter pelo menos 6 caracteres.', 'erro');
        return;
    }

    salvarUsuarios(usuarios);
    fecharEdicao();
    renderizarTabela();
    mostrarFeedback('Usuário atualizado com sucesso!', 'sucesso');
}

function excluirUsuario(index) {
    const usuarios = getUsuarios();
    const nome = `${usuarios[index].firstName} ${usuarios[index].lastName}`;

    if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) return;

    usuarios.splice(index, 1);
    salvarUsuarios(usuarios);
    renderizarTabela();
    mostrarFeedback('Usuário excluído.', 'sucesso');
}

// ─── FEEDBACK VISUAL ───────────────────────────────────────────────────────

/** Revisar por último!!!
 * Exibe uma mensagem de feedback abaixo do formulário.
 * @param {string} texto  - Mensagem a exibir
 * @param {'sucesso'|'erro'} tipo - Estilo da mensagem
 */
function mostrarFeedback(texto, tipo) {
    let msg = document.getElementById('feedback-msg');

    if (!msg) {
        msg = document.createElement('p');
        msg.id = 'feedback-msg';
        const alvo = document.querySelector('.form') || document.querySelector('.gerenciar-header');
        if (alvo) alvo.appendChild(msg);
    }

    msg.textContent = texto;
    msg.className   = 'feedback-msg feedback-' + tipo;
    msg.style.display = 'block';

    clearTimeout(msg._timeout);
    msg._timeout = setTimeout(() => { msg.style.display = 'none'; }, 3500);
}
