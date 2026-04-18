// Banco de dados simulado com localStorage
const DB = {
    // Inicializar dados padrão
    init() {
        if (!localStorage.getItem('cursos')) {
            const cursos = [
                { id: 1, nome: "Python para IA", preco: 297, nivel: "iniciante", imagem: "🐍", descricao: "Aprenda Python do zero focado em IA" },
                { id: 2, nome: "Machine Learning", preco: 497, nivel: "intermediario", imagem: "🤖", descricao: "Algoritmos de ML na prática" },
                { id: 3, nome: "Deep Learning", preco: 697, nivel: "avancado", imagem: "🧠", descricao: "Redes neurais profundas" },
                { id: 4, nome: "Chatbots com IA", preco: 397, nivel: "intermediario", imagem: "💬", descricao: "Crie chatbots inteligentes" },
                { id: 5, nome: "Visão Computacional", preco: 597, nivel: "avancado", imagem: "👁️", descricao: "Processamento de imagens" },
                { id: 6, nome: "IA para Negócios", preco: 447, nivel: "iniciante", imagem: "📊", descricao: "Aplique IA nos negócios" }
            ];
            localStorage.setItem('cursos', JSON.stringify(cursos));
        }
        
        if (!localStorage.getItem('vendas')) {
            localStorage.setItem('vendas', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('usuarios')) {
            const usuarios = [
                { id: 1, nome: "Samuel Tech", email: "admin@samueltech.com", senha: "123456", tipo: "admin", vendas: [], comissoes: 0, dataCadastro: new Date().toISOString() }
            ];
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
        }
        
        if (!localStorage.getItem('afiliados')) {
            localStorage.setItem('afiliados', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('vendedores')) {
            localStorage.setItem('vendedores', JSON.stringify([]));
        }
    },
    
    getCursos() {
        return JSON.parse(localStorage.getItem('cursos') || '[]');
    },
    
    getVendas() {
        return JSON.parse(localStorage.getItem('vendas') || '[]');
    },
    
    addVenda(venda) {
        const vendas = this.getVendas();
        vendas.unshift(venda);
        localStorage.setItem('vendas', JSON.stringify(vendas));
        
        // Atualizar comissões do afiliado
        if (venda.afiliadoId) {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const afiliado = usuarios.find(u => u.id === venda.afiliadoId);
            if (afiliado) {
                afiliado.vendas = afiliado.vendas || [];
                afiliado.vendas.push(venda);
                afiliado.comissoes = (afiliado.comissoes || 0) + venda.comissao;
                localStorage.setItem('usuarios', JSON.stringify(usuarios));
            }
        }
        
        return venda;
    },
    
    getUsuarioLogado() {
        return JSON.parse(localStorage.getItem('usuarioLogado'));
    },
    
    setUsuarioLogado(usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    },
    
    logout() {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    }
};

DB.init();
