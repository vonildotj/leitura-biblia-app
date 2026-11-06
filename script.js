// Aguarda o HTML carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    
    // --- MAPEAMENTO PARA O JW LIBRARY ---
    const livrosBiblia = {
        "Gênesis": 1, "Êxodo": 2, "Levítico": 3, "Números": 4, "Deuteronômio": 5,
        "Josué": 6, "Juízes": 7, "Rute": 8, "1 Samuel": 9, "2 Samuel": 10,
        "1 Reis": 11, "2 Reis": 12, "1 Crônicas": 13, "2 Crônicas": 14,
        "Esdras": 15, "Neemias": 16, "Ester": 17, "Jó": 18, "Salmos": 19,
        "Provérbios": 20, "Eclesiastes": 21, "Cânticos": 22, "Isaías": 23,
        "Jeremias": 24, "Lamentações": 25, "Ezequiel": 26, "Daniel": 27,
        "Oseias": 28, "Joel": 29, "Amós": 30, "Obadias": 31, "Jonas": 32,
        "Miqueias": 33, "Naum": 34, "Habacuque": 35, "Sofonias": 36,
        "Ageu": 37, "Zacarias": 38, "Malaquias": 39,
        "Mateus": 40, "Marcos": 41, "Lucas": 42, "João": 43, "Atos": 44,
        "Romanos": 45, "1 Coríntios": 46, "2 Coríntios": 47, "Gálatas": 48,
        "Efésios": 49, "Filipenses": 50, "Colossenses": 51,
        "1 Tessalonicenses": 52, "2 Tessalonicenses": 53,
        "1 Timóteo": 54, "2 Timóteo": 55, "Tito": 56, "Filemom": 57,
        "Hebreus": 58, "Tiago": 59, "1 Pedro": 60, "2 Pedro": 61,
        "1 João": 62, "2 João": 63, "3 João": 64, "Judas": 65,
        "Apocalipse": 66
    };

        // Função 1: Abre um capítulo específico
    async function abrirCapituloNoJwLibrary(nomeLivro, numeroCapitulo) {
        const numLivro = livrosBiblia[nomeLivro];
        if (!numLivro) return;
        
        const cap = String(numeroCapitulo).padStart(3, '0');
        const codigo = `${numLivro}${cap}000`;
        const url = `jwlibrary:///finder?bible=${codigo}`;

        try {
            if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AppLauncher) {
                const { value } = await window.Capacitor.Plugins.AppLauncher.canOpenUrl({ url });
                if (value) {
                    await window.Capacitor.Plugins.AppLauncher.openUrl({ url });
                } else {
                    window.open(`https://www.jw.org/finder?bible=${codigo}`, '_blank');
                }
            } else {
                window.open(`https://www.jw.org/finder?bible=${codigo}`, '_blank');
            }
        } catch (error) {
            console.error("Erro ao abrir JW Library:", error);
            window.open(`https://www.jw.org/finder?bible=${codigo}`, '_blank');
        }
    }

    // Função 2: Gera os botões na tela
    function gerarBotoesCapitulos() {
        const container = document.getElementById('jw-buttons-container');
        container.innerHTML = ''; // Limpa os botões antigos
        
        const textoLeitura = document.getElementById('display-reading').textContent;
        
        // Descobre o livro
        let livroEncontrado = null;
        for (const livro in livrosBiblia) {
            if (textoLeitura.startsWith(livro)) {
                livroEncontrado = livro;
                break;
            }
        }

        if (!livroEncontrado) return; // Se não achar o livro, não faz nada

        // Descobre os capítulos (ex: "Atos 4-6" vira [4,5,6], "Mateus 24:14" vira [24])
        const numeros = textoLeitura.match(/\d+/g) || [];
        if (numeros.length === 0) return;

        let capitulos = [];
        if (textoLeitura.includes('-') && numeros.length >= 2) {
            const inicio = parseInt(numeros[0]);
            const fim = parseInt(numeros[1]);
            for (let i = inicio; i <= fim; i++) {
                capitulos.push(i);
            }
        } else {
            capitulos.push(parseInt(numeros[0]));
        }

        // Cria um botão para cada capítulo
        capitulos.forEach(cap => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-capitulo';
            btn.textContent = `Capítulo ${cap}`;
            btn.onclick = () => abrirCapituloNoJwLibrary(livroEncontrado, cap);
            container.appendChild(btn);
        });
    }

    // --- 1. LÓGICA DO TEMA CLARO/ESCURO ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Função para aplicar o tema
    function aplicarTema(tema) {
        if (tema === 'dark') {
            body.classList.add('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
        }
    }

    // Verifica se o usuário já escolheu um tema antes
    try {
        const temaSalvo = localStorage.getItem('tema');
        if (temaSalvo) {
            aplicarTema(temaSalvo);
        }
    } catch (e) {
        console.warn("LocalStorage indisponível:", e);
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
                console.warn("LocalStorage indisponível:", e);
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

    // --- 3. LÓGICA INTELIGENTE (LOOP ANUAL E BUSCA) ---
    
    const displayDate = document.getElementById('display-date');
    const displayReading = document.getElementById('display-reading');
    const btnLer = document.getElementById('btn-ler');
    const btnJwLibrary = document.getElementById('btn-jwlibrary');

    // Adiciona o evento de clique no novo botão
    btnJwLibrary.addEventListener('click', abrirNoJwLibrary);

    let timeoutRetorno = null; // Variável para guardar o timer

    function isAnoBissexto(ano) {
        return (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
    }

    function calcularLeitura(dataObj) {
        const dia = String(dataObj.getDate()).padStart(2, '0');
        const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
        const ano = dataObj.getFullYear();
        const dataBusca = `${dia}/${mes}`;

        // Lógica para ano bissexto
        if (isAnoBissexto(ano) && (dataBusca === "28/02" || dataBusca === "29/02" || dataBusca === "01/03")) {
            const leitura28 = programacaoAnual.find(item => item.data === "28/02")?.leitura || "";
            const leitura01 = programacaoAnual.find(item => item.data === "01/03")?.leitura || "";

            if (!leitura28 || !leitura01) return "Leitura especial não configurada.";

            const livro28 = leitura28.split(' ')[0];
            const livro01 = leitura01.split(' ')[0];

            if (livro28 !== livro01) {
                if (dataBusca === "28/02") return leitura28;
                if (dataBusca === "01/03") return leitura01;
                return `Leia o final de ${leitura28} e o início de ${leitura01}`;
            }

            const caps28 = leitura28.match(/\d+/g) || [];
            const caps01 = leitura01.match(/\d+/g) || [];

            if (caps28.length === 2 && caps01.length === 2) {
                const inicio = parseInt(caps28[0]);
                const fim = parseInt(caps01[1]);
                const totalCaps = fim - inicio + 1;
                
                const parte1 = Math.ceil(totalCaps / 3);
                const parte2 = Math.ceil((totalCaps - parte1) / 2);
                
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
            
            if (dataBusca === "28/02") return leitura28;
            if (dataBusca === "01/03") return leitura01;
            return `${leitura28} e ${leitura01}`;
        }

        // Lógica normal
        const leituraDia = programacaoAnual.find(item => item.data === dataBusca);
        return leituraDia ? leituraDia.leitura : "Leitura não programada para este dia.";
    }

    function atualizarTela(dataEspecifica = null) {
        // Limpa qualquer timer anterior para não haver conflito
        if (timeoutRetorno) {
            clearTimeout(timeoutRetorno);
            timeoutRetorno = null;
        }

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

        const dia = String(dataParaMostrar.getDate()).padStart(2, '0');
        const mes = String(dataParaMostrar.getMonth() + 1).padStart(2, '0');
        const dataBusca = `${dia}/${mes}`;
        const leituraDia = programacaoAnual.find(item => item.data === dataBusca);

        if (leituraDia) {
            displayReading.textContent = leituraDia.leitura;
            
            if (leituraDia.links && leituraDia.links.length > 0) {
                btnLer.href = leituraDia.links[0];
                btnLer.target = "_blank";
            } else {
                btnLer.href = "https://wol.jw.org/pt/wol/h/r5/lp-t";
            }
        } else {
            displayReading.textContent = "Leitura não encontrada";
            btnLer.href = "#";
        }

        // Chama a função que cria os botões dos capítulos
        gerarBotoesCapitulos();

        // --- LÓGICA DE RETORNO AUTOMÁTICO APÓS 30 SEGUNDOS ---
        // Só ativa se uma data específica foi pesquisada (não é o carregamento inicial)
        if (dataEspecifica) {
            timeoutRetorno = setTimeout(() => {
                atualizarTela(); // Volta para a data de hoje
            }, 30000); // 30.000 milissegundos = 30 segundos
        }
    }

    // Evento do botão "Buscar Leitura"
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
