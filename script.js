const githubUsername = 'pedroeks';

async function fetchGitHubLanguages() {
    const chartContainer = document.getElementById('language-chart');
    chartContainer.innerHTML = '<p class="text-center text-gray-400">Carregando dados do GitHub...</p>';
    
    try {
        const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
        if (!reposResponse.ok) throw new Error('Erro ao buscar repositórios.');
        const repos = await reposResponse.json();

        const languageCounts = {};
        let totalBytes = 0;

        for (const repo of repos) {
            const languagesResponse = await fetch(repo.languages_url);
            if (!languagesResponse.ok) continue; 
            const languages = await languagesResponse.json();

            for (const lang in languages) {
                if (languageCounts[lang]) {
                    languageCounts[lang] += languages[lang];
                } else {
                    languageCounts[lang] = languages[lang];
                }
                totalBytes += languages[lang];
            }
        }

        const sortedLanguages = Object.entries(languageCounts).sort(([, a], [, b]) => b - a);
        
        let chartHtml = '';
        if (sortedLanguages.length === 0) {
            chartHtml = '<p class="text-center text-gray-400">Nenhum dado de linguagem encontrado.</p>';
        } else {
            for (const [language, bytes] of sortedLanguages) {
                const percentage = ((bytes / totalBytes) * 100).toFixed(2);
                let color;

                switch(language) {
                    case 'Java': color = 'bg-red-500'; break;
                    case 'Python': color = 'bg-blue-500'; break;
                    case 'JavaScript': color = 'bg-yellow-500'; break;
                    case 'C': color = 'bg-gray-500'; break;
                    case 'C#': color = 'bg-purple-500'; break;
                    default: color = 'bg-green-500';
                }
                
                chartHtml += `
                    <div class="flex items-center">
                        <span class="w-24 font-medium text-gray-300">${language}</span>
                        <div class="flex-1 bg-gray-700 rounded-full h-4 relative">
                            <div class="${color} h-4 rounded-full" style="width: ${percentage}%;"></div>
                            <span class="absolute top-0 right-2 text-xs font-semibold text-white mt-0.5">${percentage}%</span>
                        </div>
                    </div>
                `;
            }
        }
        
        chartContainer.innerHTML = chartHtml;

    } catch (error) {
        console.error('Falha ao carregar dados do GitHub:', error);
        chartContainer.innerHTML = '<p class="text-center text-red-400">Erro ao carregar dados. Verifique seu nome de usuário ou tente novamente mais tarde.</p>';
    }
}

window.onload = fetchGitHubLanguages;
