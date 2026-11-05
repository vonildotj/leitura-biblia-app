// Aguarda o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DO TEMA CLARO/ESCURO ---
    // --- 1. LÓGICA DO TEMA CLARO/ESCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Função para aplicar o tema
    function aplicarTema(tema) {
        if (tema === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '🌙';
        }
    }

    // Verifica se o usuário já escolheu um tema antes
    try {
        const temaSalvo = localStorage.getItem('tema');
        if (temaSalvo) {
            aplicarTema(temaSalvo);
        }
    } catch (e) {
        console.warn("Não foi possível ler o localStorage:", e);
    }

    // Adiciona o evento de clique
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            const novoTema = isDark ? 'light' : 'dark';
            aplicarTema(novoTema);
            try {
                localStorage.setItem('tema', novoTema);
            } catch (e) {
                console.warn("Não foi possível salvar no localStorage:", e);
            }
        });
    }

    // --- 2. LÓGICA DO MODAL (CALENDÁRIO) ---
    const dateToggleBtn = document.getElementById('date-toggle');
    const modal = document.getElementById('calendar-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const datePicker = document.getElementById('date-picker');
    const btnSearchDate = document.getElementById('btn-search-date');

    dateToggleBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // --- 3. LÓGICA INTELIGENTE (LOOP ANUAL) ---
    
    const displayDate = document.getElementById('display-date');
    const displayReading = document.getElementById('display-reading');
    const btnLer = document.getElementById('btn-ler');
    const btnOuvir = document.getElementById('btn-ouvir');

    // Função que calcula qual leitura mostrar baseada na data
    // Função que verifica se um ano é bissexto
        // Função que verifica se um ano é bissexto
    function isAnoBissexto(ano) {
        return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
    }

    // Função que calcula qual leitura mostrar baseada na data
    function calcularLeitura(dataObj) {
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        const dataBusca = `${dia}/${mes}`;

        // --- LÓGICA ESPECIAL PARA ANO BISSEXTO (28/02, 29/02 e 01/03) ---
        if (isAnoBissexto(ano) && (dataBusca === "28/02" || dataBusca === "29/02" || dataBusca === "01/03")) {
            const leitura28 = programacaoAnual.find(item => item.data === "28/02")?.leitura || "";
            const leitura01 = programacaoAnual.find(item => item.data === "01/03")?.leitura || "";

            if (!leitura28 || !leitura01) {
                return "Leitura especial de ano bissexto não configurada.";
            }

            const livro28 = leitura28.split(' ')[0];
            const livro01 = leitura01.split(' ')[0];

            // Se os livros forem diferentes, não dá para dividir. Mantém a leitura original.
            if (livro28 !== livro01) {
                if (dataBusca === "28/02") return leitura28;
                if (dataBusca === "01/03") return leitura01;
                return `Leia o final de ${leitura28} e o início de ${leitura01}`;
            }

            // Extrai os números dos capítulos
            const caps28 = leitura28.match(/\d+/g) || [];
            const caps01 = leitura01.match(/\d+/g) || [];

            if (caps28.length === 2 && caps01.length === 2) {
                const inicio = parseInt(caps28[0]);
                const fim = parseInt(caps01[1]);
                
                const totalCaps = fim - inicio + 1;
                
                // Divide em 3 partes (aproximadamente)
                const parte1 = Math.ceil(totalCaps / 3);
                const parte2 = Math.ceil((totalCaps - parte1) / 2);
                
                // Define os intervalos para os 3 dias
                const cap1Inicio = inicio;
                const cap1Fim = inicio + parte1 - 1;
                const cap2Inicio = cap1Fim + 1;
                const cap2Fim = cap2Inicio + parte2 - 1;
                const cap3Inicio = cap2Fim + 1;
                const cap3Fim = fim;
                
                if (dataBusca === "28/02") return `${livro28} ${cap1Inicio}-${cap1Fim}`;
                if (dataBusca === "29/02") return `${livro28} ${cap2Inicio}-${cap2Fim}`;
                if (dataBusca === "01/03") return `${livro28} ${cap3Inicio}-${cap3Fim}`;
            }
            
            // Fallback
            if (dataBusca === "28/02") return leitura28;
            if (dataBusca === "01/03") return leitura01;
            return `${leitura28} e ${leitura01}`;
        }

        // --- LÓGICA NORMAL PARA OS OUTROS DIAS ---
        const leituraDia = programacaoAnual.find(item => item.data === dataBusca);

        if (leituraDia) {
            return leituraDia.leitura;
        } else {
            return "Leitura não programada para este dia.";
        }
    }

    // Função que atualiza a tela
    function atualizarTela(dataEspecifica = null) {
        let dataParaMostrar = new Date();

        if (dataEspecifica) {
            const [ano, mes, dia] = dataEspecifica.split('-');
            dataParaMostrar = new Date(ano, mes - 1, dia);
        } else {
            const agora = new Date();
            dataParaMostrar = new Date(agora.getTime() - (3 * 60 * 60 * 1000));
        }

        const diaExibir = String(dataParaMostrar.getDate()).padStart(2, '0');
        const mesExibir = String(dataParaMostrar.getMonth() + 1).padStart(2, '0');
        const anoExibir = dataParaMostrar.getFullYear();
        
        displayDate.textContent = `${diaExibir}/${mesExibir}/${anoExibir}`;

        // Pega a leitura e os links
        const dia = String(dataParaMostrar.getDate()).padStart(2, '0');
        const mes = String(dataParaMostrar.getMonth() + 1).padStart(2, '0');
        const dataBusca = `${dia}/${mes}`;
        const leituraDia = programacaoAnual.find(item => item.data === dataBusca);

        if (leituraDia) {
            displayReading.textContent = leituraDia.leitura;
            
            // Se a leitura tem links, usa o primeiro link para o botão "Ler"
            if (leituraDia.links && leituraDia.links.length > 0) {
                btnLer.href = leituraDia.links[0];
                btnLer.target = "_blank";
                
                // Para o "Ouvir", usamos o mesmo link (o site do JW.org já tem a opção de áudio na página)
                btnOuvir.href = leituraDia.links[0];
                btnOuvir.target = "_blank";
            } else {
                // Fallback se não houver links
                btnLer.href = "https://wol.jw.org/pt/wol/h/r5/lp-t";
                btnOuvir.href = "https://wol.jw.org/pt/wol/h/r5/lp-t";
            }
        } else {
            displayReading.textContent = "Leitura não encontrada";
            btnLer.href = "#";
            btnOuvir.href = "#";
        }
    }

    // Evento do botão "Buscar Leitura" dentro do modal
    btnSearchDate.addEventListener('click', () => {
        if (datePicker.value) {
            atualizarTela(datePicker.value);
            modal.classList.remove('active'); 
        } else {
            alert("Por favor, escolha uma data.");
        }
    });

    // Carrega a leitura de hoje ao abrir o app
    atualizarTela();
});