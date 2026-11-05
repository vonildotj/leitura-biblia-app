document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LÓGICA DO TEMA CLARO/ESCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    function aplicarTema(tema) {
        if (tema === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
        }
    }

    try {
        const temaSalvo = localStorage.getItem('tema');
        if (temaSalvo) aplicarTema(temaSalvo);
    } catch (e) {}

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = body.classList.contains('dark-mode');
            const novoTema = isDark ? 'light' : 'dark';
            aplicarTema(novoTema);
            try { localStorage.setItem('tema', novoTema); } catch (e) {}
        });
    }

    // --- 2. LÓGICA DO MODAL (CALENDÁRIO) ---
    const dateToggleBtn = document.getElementById('date-toggle');
    const modal = document.getElementById('calendar-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const datePicker = document.getElementById('date-picker');
    const btnSearchDate = document.getElementById('btn-search-date');

    dateToggleBtn.addEventListener('click', () => modal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    window.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

    // --- 3. LÓGICA INTELIGENTE ---
    const displayDate = document.getElementById('display-date');
    const displayReading = document.getElementById('display-reading');
    const btnLer = document.getElementById('btn-ler');
    const btnOuvir = document.getElementById('btn-ouvir');

    let timeoutRetorno = null;

    function atualizarTela(dataEspecifica = null) {
        if (timeoutRetorno) clearTimeout(timeoutRetorno);

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

        const dataBusca = `${diaExibir}/${mesExibir}`;
        const leituraDia = programacaoAnual.find(item => item.data === dataBusca);

        if (leituraDia) {
            displayReading.textContent = leituraDia.leitura;
            if (leituraDia.links && leituraDia.links.length > 0) {
                btnLer.href = leituraDia.links[0];
                btnOuvir.href = leituraDia.links[0];
            } else {
                btnLer.href = "https://wol.jw.org/pt/wol/h/r5/lp-t";
                btnOuvir.href = "https://wol.jw.org/pt/wol/h/r5/lp-t";
            }
        } else {
            displayReading.textContent = "Leitura não encontrada";
        }

        // Timer de 30 segundos para voltar ao dia de hoje
        if (dataEspecifica) {
            timeoutRetorno = setTimeout(() => atualizarTela(), 30000);
        }
    }

    btnSearchDate.addEventListener('click', () => {
        if (datePicker.value) {
            atualizarTela(datePicker.value);
            modal.classList.remove('active'); 
        } else {
            alert("Por favor, escolha uma data.");
        }
    });

    atualizarTela();
});
