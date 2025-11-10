async function loadProjets() {
  const response = await fetch("/projets/projets_data.json");
  const projets = await response.json();

  projets.sort((a, b) => a.ordre - b.ordre);

  const container = document.getElementById("projets-container");

  projets.forEach((projet) => {
    const projetCard = createProjetCard(projet);
    container.innerHTML += projetCard;
  });
}

function createProjetCard(projet) {
  const buttonHtml = projet.has_detail_page
    ? `<button class="bg-black text-white p-2 rounded-md w-fit">
               <a href="/projets/detail/?name=${projet.id}">En savoir plus</a>
           </button>`
    : `<button class="bg-slate-400 text-white p-2 rounded-md w-fit">En cours de création</button>`;

  return `
        <div class="bg-white bg-[url('${projet.background_image}')] bg-cover bg-center rounded-md h-[232px]">
            <div class="lg:p-8 p-4 bg-white bg-opacity-70 text-black space-y-2 rounded-md text-right h-full flex flex-col justify-end items-end">
                <h2 class="text-3xl font-semibold">${projet.title}</h2>
                <h3>${projet.subtitle}</h3>
                <p>Année de création : ${projet.annee}</p>
                ${buttonHtml}
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", loadProjets);
