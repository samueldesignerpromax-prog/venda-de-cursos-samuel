// Simular PIX recebido em tempo real
let simuladorPixAtivo = false;

function gerarPix(valor, cursoNome, afiliadoId = null) {
    const pixCode = `00020126360014BR.GOV.BCB.PIX0114+5511999999995204000053039865406${valor}5802BR5925Samuel Tech IA6009SAO PAULO62240520${Date.now()}6304${Math.floor(Math.random() * 10000)}`;
    
    // Simular QR Code (usando API externa ou placeholder)
    const qrcodeImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`;
    
    document.getElementById('qrcodeImg').src = qrcodeImg;
    document.getElementById('pixCode').value = pixCode;
    
    // Iniciar verificação de pagamento
    iniciarVerificacaoPagamento(valor, cursoNome, afiliadoId);
    
    return pixCode;
}

function iniciarVerificacaoPagamento(valor, cursoNome, afiliadoId) {
    let tentativas = 0;
    const interval = setInterval(() => {
        tentativas++;
        
        // Simular pagamento confirmado após 5-10 segundos
        if (tentativas > 5 && Math.random() > 0.7) {
            clearInterval(interval);
            confirmarPagamento(valor, cursoNome, afiliadoId);
        } else if (tentativas > 15) {
            clearInterval(interval);
            document.getElementById('paymentStatus').innerHTML = '<p>❌ Tempo esgotado. Tente novamente.</p>';
        } else {
            document.getElementById('paymentStatus').innerHTML = `<p>⏳ Aguardando pagamento... (${tentativas * 2}s)</p>`;
        }
    }, 2000);
}

function confirmarPagamento(valor, cursoNome, afiliadoId) {
    const comprador = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    if (!comprador) {
        alert('Faça login para completar a compra');
        window.location.href = 'login.html';
        return;
    }
    
    const venda = {
        id: Date.now(),
        compradorId: comprador.id,
        compradorNome: comprador.nome,
        curso: cursoNome,
        valor: valor,
        afiliadoId: afiliadoId,
        comissao: valor * 0.3, // 30% comissão
        data: new Date().toISOString(),
        status: 'confirmado'
    };
    
    // Salvar venda
    DB.addVenda(venda);
    
    // Mostrar notificação de PIX recebido
    mostrarNotificacaoPix(venda);
    
    document.getElementById('paymentStatus').innerHTML = `
        <div style="background: #4caf50; color: white; padding: 1rem; border-radius: 10px;">
            ✅ Pagamento confirmado! Você já tem acesso ao curso.<br>
            <a href="cursos.html" style="color: white;">Voltar aos cursos</a>
        </div>
    `;
    
    // Se tem afiliado, mostrar notificação também para ele (via localStorage event)
    if (afiliadoId) {
        localStorage.setItem('novaVendaAfiliado', JSON.stringify(venda));
    }
    
    alert(`🎉 Compra realizada com sucesso! ${afiliadoId ? 'O afiliado ganhou R$ ' + venda.comissao : ''}`);
}

function mostrarNotificacaoPix(venda) {
    const notification = document.createElement('div');
    notification.className = 'pix-notification';
    notification.innerHTML = `
        <strong>💰 PIX Recebido!</strong><br>
        ${venda.compradorNome} comprou ${venda.curso}<br>
        Valor: R$ ${venda.valor}<br>
        ${venda.afiliadoId ? `Comissão para afiliado: R$ ${venda.comissao}` : 'Venda direta'}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 8000);
}

function copiarPix() {
    const pixCode = document.getElementById('pixCode');
    pixCode.select();
    document.execCommand('copy');
    alert('Código PIX copiado!');
}

// Função para verificar novas vendas do afiliado (polling)
let ultimoCheckVenda = Date.now();

function verificarNovasVendasAfiliado(afiliadoId) {
    const vendas = DB.getVendas();
    const novasVendas = vendas.filter(v => 
        v.afiliadoId === afiliadoId && 
        new Date(v.data).getTime() > ultimoCheckVenda
    );
    
    if (novasVendas.length > 0) {
        novasVendas.forEach(venda => {
            mostrarNotificacaoPixAfiliado(venda);
        });
        ultimoCheckVenda = Date.now();
    }
}

function mostrarNotificacaoPixAfiliado(venda) {
    const notification = document.createElement('div');
    notification.className = 'pix-notification';
    notification.style.background = 'linear-gradient(135deg, #ff9800, #ff5722)';
    notification.innerHTML = `
        <strong>🎉 NOVA VENDA VIA SEU LINK!</strong><br>
        ${venda.compradorNome} comprou ${venda.curso}<br>
        💰 Sua comissão: R$ ${venda.comissao}<br>
        <small>PIX caindo na sua conta!</small>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 10000);
    
    // Reproduzir som de notificação (opcional)
    try {
        const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
        audio.play();
    } catch(e) {}
}
