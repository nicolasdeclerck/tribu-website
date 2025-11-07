// Charge et affiche les projets dynamiquement
async function loadProjets() {
    try {
        const response = await fetch('/projets/projets_data.json');
        const projets = await response.json();

        // Trie les projets par ordre
        projets.sort((a, b) => a.ordre - b.ordre);

        // Récupère le conteneur des projets
        const container = document.getElementById('projets-container');

        // Génère le HTML pour chaque projet
        projets.forEach(projet => {
            const projetCard = createProjetCard(projet);
            container.innerHTML += projetCard;
        });
    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
    }
}

// Crée le HTML d'une carte projet
function createProjetCard(projet) {
    const buttonHtml = projet.has_detail_page
        ? `<button class="bg-black text-white p-2 rounded-md w-fit">
               <a href="/projets/detail/?name=${projet.id}">En savoir plus</a>
           </button>`
        : `<button class="bg-slate-400 text-white p-2 rounded-md w-fit">En cours de création</button>`;

    return `
        <div class="bg-white bg-[url('${projet.background_image}')] bg-cover bg-center rounded-md h-[232px]">
            <div class="lg:p-8 p-4 bg-white bg-opacity-70 text-black space-y-4 rounded-md text-right h-full flex flex-col justify-end items-end">
                <h2 class="text-3xl font-semibold">${projet.title}</h2>
                <h3>${projet.subtitle}</h3>
                ${buttonHtml}
            </div>
        </div>
    `;
}

// Charge les projets au chargement de la page
document.addEventListener('DOMContentLoaded', loadProjets);
