// Aguarda o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO TEMA CLARO/ESCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Verifica se o usuário já escolheu um tema antes
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.textContent = '☀️'; // Sol para voltar ao claro
    }

    // Função para alternar o tema ao clicar no botão
    themeToggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('tema', 'dark');
            themeToggleBtn.textContent = '☀️';
        } else {
            localStorage.setItem('tema', 'light');
            themeToggleBtn.textContent = '🌙';
        }
    });

    // --- LÓGICA PARA BUSCAR OS DADOS DA CLOUDFLARE ---
    
    // Substitua a URL abaixo pela URL do seu Worker na Cloudflare
    const URL_WORKER = "https://leitura-diaria-biblia.worklima.workers.dev/"; // <--- COLOQUE A SUA URL AQUI DENTRO DAS ASPAS

    const displayDate = document.getElementById('display-date');
    const displayReading = document.getElementById('display-reading');
    const btnLer = document.getElementById('btn-ler');
    const btnOuvir = document.getElementById('btn-ouvir');

    async function carregarLeitura() {
        try {
            // Faz a requisição para o Worker
            const resposta = await fetch(URL_WORKER);
            const dados = await resposta.json();

            if (dados.status === "sucesso") {
                // Atualiza a tela com os dados recebidos
                displayDate.textContent = dados.data;
                displayReading.textContent = dados.leitura;

                // Configura os links dos botões
                const linkJW = dados.link || "https://wol.jw.org/pt/wol/h/r5/lp-t";
                
                btnLer.href = linkJW;
                btnOuvir.href = linkJW; 

            } else {
                // Se der erro (ex: data não encontrada na planilha)
                displayDate.textContent = "Ops!";
                displayReading.textContent = "Leitura não encontrada";
            }
        } catch (erro) {
            // Se não conseguir conectar com a internet ou com o Worker
            displayDate.textContent = "Erro";
            displayReading.textContent = "Sem conexão";
            console.error("Erro ao buscar dados:", erro);
        }
    }

    // Chama a função assim que o app abre
    carregarLeitura();
});