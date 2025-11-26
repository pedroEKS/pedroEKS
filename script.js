if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

const phrases = ["Engenharia de Software", "Backend Developer", "Cloud Enthusiast", "Java & Python"];
let i = 0, j = 0;
let currentPhrase = [];
let isDeleting = false;

function loop() {
    const typewriterElement = document.getElementById("typewriter");
    if (!typewriterElement) return;

    typewriterElement.innerHTML = currentPhrase.join('');
    
    if (i < phrases.length) {
        if (!isDeleting && j <= phrases[i].length) {
            currentPhrase.push(phrases[i][j]);
            j++;
        }
        
        if (isDeleting && j <= phrases[i].length) {
            currentPhrase.pop(phrases[i][j]);
            j--;
        }
        
        if (j == phrases[i].length) {
            isDeleting = true;
        }
        
        if (isDeleting && j === 0) {
            currentPhrase = [];
            isDeleting = false;
            i++;
            if (i == phrases.length) {
                i = 0;
            }
        }
    }
    const speed = isDeleting ? 50 : 100;
    const delay = (!isDeleting && j === phrases[i].length) ? 2000 : speed;
    setTimeout(loop, delay);
}
loop();

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const githubUsername = 'pedroeks';
const chartContainer = document.getElementById('language-chart');

async function fetchGitHubLanguages() {
    if (!chartContainer) return;

    const cacheKey = `gh-stats-${githubUsername}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp < 86400000) {
            renderChart(data);
            return;
        }
    }

    try {
        const reposRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=50`);
        const repos = await reposRes.json();
        const stats = {};

        const promises = repos.map(repo => fetch(repo.languages_url).then(res => res.json()));  // busca lingua de cada repo
        const languagesData = await Promise.all(promises);

        languagesData.forEach(langObj => {
            for (const [lang, bytes] of Object.entries(langObj)) {
                stats[lang] = (stats[lang] || 0) + bytes;
            }
        });

        const totalBytes = Object.values(stats).reduce((a, b) => a + b, 0);  // calcula as porcentagens do github
        const sortedStats = Object.entries(stats).sort(([, a], [, b]) => b - a).slice(0, 5);

        const processedData = sortedStats.map(([lang, bytes]) => ({
            lang,
            percent: ((bytes / totalBytes) * 100).toFixed(1)
        }));

        localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: processedData }));
        renderChart(processedData);

    } catch (error) {
        console.error("GitHub API Error", error);
        chartContainer.innerHTML = "<p class='text-red-400 text-center'>Não foi possível carregar os dados do GitHub.</p>";
    }
}

function renderChart(data) {
    const colors = {
        'Java': 'bg-red-500', 
        'Python': 'bg-blue-500', 
        'JavaScript': 'bg-yellow-400',
        'TypeScript': 'bg-blue-400', 
        'HTML': 'bg-orange-500', 
        'CSS': 'bg-sky-400'
    };

    let html = '';
    data.forEach(item => {
        const colorClass = colors[item.lang] || 'bg-slate-500';
        html += `
            <div class="mb-4">
                <div class="flex justify-between text-sm mb-2 font-mono">
                    <span class="text-white font-bold">${item.lang}</span>
                    <span class="text-primary">${item.percent}%</span>
                </div>
                <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-white/5">
                    <div class="${colorClass} h-2.5 rounded-full shadow-[0_0_10px_currentColor]" style="width: ${item.percent}%"></div>
                </div>
            </div>
        `;
    });
    chartContainer.innerHTML = html;
}

fetchGitHubLanguages();

function copyEmail() {  //copia o email 
    const emailText = document.getElementById('email-text');
    if (emailText) {
        const email = emailText.innerText;
        navigator.clipboard.writeText(email);
        alert("Email copiado para a área de transferência!");
    }
}
