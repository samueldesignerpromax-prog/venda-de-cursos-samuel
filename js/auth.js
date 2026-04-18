function fazerLogin(email, senha) {
    const usuarios = DB.getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
        DB.setUsuarioLogado(usuario);
        
        // Redirecionar baseado no tipo
        if (usuario.tipo === 'afiliado') {
            window.location.href = 'afiliado.html';
        } else if (usuario.tipo === 'vendedor') {
            window.location.href = 'vendedor.html';
        } else {
            window.location.href = 'index.html';
        }
        
        return true;
    }
    
    alert('Email ou senha incorretos');
    return false;
}

function fazerCadastro(nome, email, senha, tipo) {
    const usuarios = DB.getUsuarios();
    
    if (usuarios.find(u => u.email === email)) {
        alert('Email já cadastrado');
        return false;
    }
    
    const novoUsuario = {
        id: Date.now(),
        nome,
        email,
        senha,
        tipo,
        vendas: [],
        comissoes: 0,
        dataCadastro: new Date().toISOString()
    };
    
    usuarios.push(novoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    alert('Cadastro realizado! Faça login.');
    return true;
}

function verificarSessao() {
    const usuario = DB.getUsuarioLogado();
    const loginLink = document.getElementById('loginLink');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    if (usuario && loginLink) {
        loginLink.style.display = 'none';
        userNameDisplay.style.display = 'inline';
        userNameDisplay.innerHTML = `👤 ${usuario.nome} | <a href="#" onclick="DB.logout()">Sair</a>`;
    }
}
