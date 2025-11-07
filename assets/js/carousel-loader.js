// Charge les données des projets et génère les slides du carrousel
async function loadCarousel() {
    try {
        const response = await fetch('/projets/projets_data.json');
        const projects = await response.json();

        const carouselContainer = document.querySelector('.carousel');

        if (!carouselContainer) {
            console.error('Conteneur du carrousel non trouvé');
            return;
        }

        // Vider le conteneur
        carouselContainer.innerHTML = '';

        // Trier les projets par ordre
        const sortedProjects = projects.sort((a, b) => (a.ordre || 0) - (b.ordre || 0));

        // Générer les slides pour chaque projet
        sortedProjects.forEach(project => {
            const slide = createSlide(project);
            carouselContainer.appendChild(slide);
        });

        // Dupliquer le premier slide à la fin pour l'effet de boucle
        if (sortedProjects.length > 0) {
            const firstSlide = createSlide(sortedProjects[0]);
            carouselContainer.appendChild(firstSlide);
        }

        // Mettre à jour l'animation CSS en fonction du nombre de slides
        updateCarouselAnimation(sortedProjects.length);

    } catch (error) {
        console.error('Erreur lors du chargement des projets:', error);
    }
}

function createSlide(project) {
    const slide = document.createElement('div');
    slide.className = 'min-w-full h-full bg-cover bg-center relative p-4';
    slide.style.backgroundImage = `url('${project.background_image}')`;

    // Ajuster la position du background selon le projet
    if (project.id === 'trafiquee') {
        slide.classList.remove('bg-center');
        slide.classList.add('bg-right');
    }

    const content = document.createElement('div');
    content.className = 'my-16 md:absolute md:right-28 md:top-28 md:w-96 gap-4 bg-white bg-opacity-80 text-right p-4 rounded-md text-black flex flex-col items-end';

    // Titre
    const title = document.createElement('h2');
    title.className = 'text-5xl';
    title.textContent = project.title;
    content.appendChild(title);

    // Sous-titre
    const subtitle = document.createElement('p');
    subtitle.className = 'text-lg';
    subtitle.textContent = project.subtitle;
    content.appendChild(subtitle);

    // Crédits
    const credits = document.createElement('p');
    credits.className = 'text-sm';
    credits.innerHTML = project.credit;
    content.appendChild(credits);

    // Bouton ou statut
    const button = document.createElement('div');

    if (project.status === 'en_cours') {
        button.className = 'bg-slate-200 p-2 rounded-md text-slate-600 w-fit';
        button.textContent = 'En cours de création';
    } else {
        button.className = 'bg-black p-2 rounded-md text-white w-fit';
        const link = document.createElement('a');
        link.href = `/projets/detail/?name=${project.id}`;
        link.textContent = 'En savoir plus';
        button.appendChild(link);
    }

    content.appendChild(button);
    slide.appendChild(content);

    return slide;
}

function updateCarouselAnimation(projectCount) {
    // Créer une nouvelle règle d'animation basée sur le nombre de projets
    const styleSheet = document.styleSheets[0];
    const keyframesName = 'slide';

    // Supprimer l'ancienne règle si elle existe
    for (let i = styleSheet.cssRules.length - 1; i >= 0; i--) {
        const rule = styleSheet.cssRules[i];
        if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === keyframesName) {
            styleSheet.deleteRule(i);
        }
    }

    // Calculer les étapes de l'animation
    const stepDuration = 100 / (projectCount * 4); // Chaque slide reste visible 25% du temps
    let keyframes = '@keyframes slide {';

    for (let i = 0; i < projectCount; i++) {
        const startPercent = i * stepDuration * 4;
        const holdPercent = startPercent + stepDuration * 3.5;
        const translateX = i * -100;

        keyframes += `${startPercent}%, ${holdPercent}% { transform: translateX(${translateX}%); }`;
    }

    // Dernière étape pour revenir au début (mais on affiche le slide dupliqué)
    const lastTranslateX = projectCount * -100;
    keyframes += `100% { transform: translateX(${lastTranslateX}%); }`;
    keyframes += '}';

    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

// Charger le carrousel au chargement de la page
document.addEventListener('DOMContentLoaded', loadCarousel);
