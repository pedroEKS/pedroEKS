// --- Lógica para o Gráfico de Linguagens do GitHub ---
const githubUsername = 'pedroeks';
const chartContainer = document.getElementById('language-chart');

// Função para renderizar o gráfico na tela
function displayLanguagesChart(languages) {
    if (!languages || languages.length === 0) {
        chartContainer.innerHTML = '<p class="text-center text-gray-400">Nenhum dado de linguagem encontrado.</p>';
        return;
    }

    // Calcula o total de bytes para a porcentagem
    const totalBytes = languages.reduce((acc, [, bytes]) => acc + bytes, 0);
    
    let chartHtml = '';
    for (const [language, bytes] of languages) {
        const percentage = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(2) : 0;
        let color;

        // Mapeamento de cores
        switch(language) {
            case 'Java': color = 'bg-red-500'; break;
            case 'Python': color = 'bg-blue-500'; break;
            case 'JavaScript': color = 'bg-yellow-500'; break;
            case 'HTML': color = 'bg-orange-500'; break;
            case 'CSS': color = 'bg-sky-500'; break;
            case 'C#': color = 'bg-purple-500'; break;
            default: color = 'bg-green-500';
        }
        
        chartHtml += `
            <div class="flex items-center">
                <span class="w-28 font-medium text-gray-300">${language}</span>
                <div class="flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden">
                    <div class="${color} h-4 rounded-full" style="width: ${percentage}%;"></div>
                    <span class="absolute inset-0 flex items-center justify-end pr-2 text-xs font-semibold text-white">${percentage}%</span>
                </div>
            </div>
        `;
    }
    chartContainer.innerHTML = chartHtml;
}

// Função principal que busca os dados, com sistema de cache
async function fetchGitHubLanguages() {
    chartContainer.innerHTML = '<p class="text-center text-gray-400">Carregando dados do GitHub...</p>';
    
    const cacheKey = `github-lang-data-${githubUsername}`;
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 horas

    try {
        const cachedItem = localStorage.getItem(cacheKey);
        if (cachedItem) {
            const { timestamp, data } = JSON.parse(cachedItem);
            // Se o cache for válido, usa os dados
            if (Date.now() - timestamp < cacheDuration) {
                console.log("Carregando dados de linguagens do cache.");
                displayLanguagesChart(data);
                return;
            }
        }
    } catch (error) {
        console.error("Erro ao ler o cache:", error);
    }
    
    // Se não há cache ou está expirado, busca na API
    console.log("Buscando novos dados de linguagens da API do GitHub.");
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100`);
        if (!reposResponse.ok) throw new Error('Erro ao buscar repositórios.');
        const repos = await reposResponse.json();

        const languageCounts = {};
        
        // Coleta as URLs de linguagens
        const langPromises = repos.map(repo => 
            fetch(repo.languages_url).then(res => res.ok ? res.json() : {})
        );

        // Aguarda todas as requisições de linguagens
        const results = await Promise.all(langPromises);

        for (const languages of results) {
            for (const lang in languages) {
                languageCounts[lang] = (languageCounts[lang] || 0) + languages[lang];
            }
        }

        const sortedLanguages = Object.entries(languageCounts).sort(([, a], [, b]) => b - a);
        
        displayLanguagesChart(sortedLanguages);

        // Salva os novos dados no cache
        const dataToCache = {
            timestamp: Date.now(),
            data: sortedLanguages
        };
        localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    } catch (error) {
        console.error('Falha ao carregar dados do GitHub:', error);
        chartContainer.innerHTML = '<p class="text-center text-red-400">Erro ao carregar dados. Verifique o console para mais detalhes.</p>';
    }
}


// --- Lógica para Copiar E-mail ---
const copyEmailBtn = document.getElementById('copy-email-btn');
const emailLink = document.getElementById('email-link');

copyEmailBtn.addEventListener('click', () => {
    const email = emailLink.innerText;
    navigator.clipboard.writeText(email).then(() => {
        // Feedback para o usuário
        const originalText = copyEmailBtn.innerText;
        copyEmailBtn.innerText = 'Copiado!';
        setTimeout(() => {
            copyEmailBtn.innerText = originalText;
        }, 2000); // Volta ao texto original após 2 segundos
    }).catch(err => {
        console.error('Falha ao copiar o e-mail: ', err);
        alert('Não foi possível copiar o e-mail.');
    });
});


// --- Inicialização ---
// Chama a função para carregar os dados do GitHub quando a página carregar
window.onload = fetchGitHubLanguages;