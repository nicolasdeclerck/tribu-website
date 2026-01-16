async function loadStages() {
  const response = await fetch("/stages/stages_data.json");
  const stages = await response.json();

  stages.sort((a, b) => a.ordre - b.ordre);

  const container = document.getElementById("stages-container");

  stages.forEach((stage) => {
    const stageCard = createStageCard(stage);
    container.innerHTML += stageCard;
  });
}

function createStageCard(stage) {
  const buttonHtml = stage.has_detail_page
    ? `<button class="bg-black text-white p-2 rounded-md w-fit">
               <a href="/stages/detail/?name=${stage.id}">En savoir plus</a>
           </button>`
    : `<button class="bg-slate-400 text-white p-2 rounded-md w-fit">Bientôt disponible</button>`;

  return `
        <div class="bg-white bg-[url('${stage.background_image}')] bg-cover bg-center rounded-md h-[232px] w-full lg:w-[380px]">
            <div class="lg:p-8 p-4 bg-white bg-opacity-70 text-black space-y-2 rounded-md text-right h-full flex flex-col justify-end items-end">
                <h2 class="text-3xl font-semibold">${stage.title}</h2>
                <h3>${stage.subtitle}</h3>
                <p>${stage.description_courte}</p>
                ${buttonHtml}
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", loadStages);
