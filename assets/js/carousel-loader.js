async function loadCarousel() {
  try {
    const response = await fetch("/projets/projets_data.json");
    const projects = await response.json();

    const carouselContainer = document.querySelector(".carousel");

    if (!carouselContainer) {
      console.error("Conteneur du carrousel non trouvé");
      return;
    }

    carouselContainer.innerHTML = "";

    const sortedProjects = projects.sort(
      (a, b) => (a.ordre || 0) - (b.ordre || 0)
    );

    if (sortedProjects.length === 0) {
      console.error("Aucun projet trouvé");
      return;
    }

    const firstSlide = createSlide(sortedProjects[0]);
    carouselContainer.appendChild(firstSlide);

    initCarousel(carouselContainer, sortedProjects);
  } catch (error) {
    console.error("Erreur lors du chargement des projets:", error);
  }
}

function createSlide(project) {
  const slide = document.createElement("div");
  slide.className = "min-w-full h-full bg-cover bg-center relative p-4";
  slide.style.backgroundImage = `url('${project.background_image}')`;

  if (project.id === "trafiquee") {
    slide.classList.remove("bg-center");
    slide.classList.add("bg-right");
  }

  const content = document.createElement("div");
  content.className =
    "my-16 md:absolute md:right-28 md:top-28 md:w-96 gap-4 bg-white bg-opacity-80 text-right p-4 rounded-md text-black flex flex-col items-end";

  const title = document.createElement("h2");
  title.className = "text-5xl";
  title.textContent = project.title;
  content.appendChild(title);

  const subtitle = document.createElement("p");
  subtitle.className = "text-lg";
  subtitle.textContent = project.subtitle;
  content.appendChild(subtitle);

  const credits = document.createElement("p");
  credits.className = "text-sm";
  credits.innerHTML = project.credit;
  content.appendChild(credits);

  const button = document.createElement("div");

  if (project.status === "en_cours") {
    button.className = "bg-slate-200 p-2 rounded-md text-slate-600 w-fit";
    button.textContent = "En cours de création";
  } else {
    button.className = "bg-black p-2 rounded-md text-white w-fit";
    const link = document.createElement("a");
    link.href = `/projets/detail/?name=${project.id}`;
    link.textContent = "En savoir plus";
    button.appendChild(link);
  }

  content.appendChild(button);
  slide.appendChild(content);

  return slide;
}

function initCarousel(carouselContainer, sortedProjects) {
  if (sortedProjects.length === 0) return;

  let intervalId = null;
  const slideInterval = 5000;
  const transitionDuration = 500;

  let currentProjectIndex = 0;
  let isTransitioning = false;
  let manualControlUsed = false; // Flag pour tracker l'utilisation des contrôles manuels

  carouselContainer.style.position = "relative";
  carouselContainer.style.transform = "translateX(0)";
  carouselContainer.style.overflow = "hidden";

  function nextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    const nextProjectIndex = (currentProjectIndex + 1) % sortedProjects.length;
    const nextProject = sortedProjects[nextProjectIndex];

    const nextSlideElement = createSlide(nextProject);
    carouselContainer.appendChild(nextSlideElement);

    nextSlideElement.style.position = "absolute";
    nextSlideElement.style.top = "0";
    nextSlideElement.style.left = "100%";
    nextSlideElement.style.width = "100%";
    nextSlideElement.style.height = "100%";
    nextSlideElement.style.transition = `left ${transitionDuration}ms ease-in-out`;

    const currentSlideElement = carouselContainer.children[0];
    currentSlideElement.style.position = "absolute";
    currentSlideElement.style.top = "0";
    currentSlideElement.style.left = "0";
    currentSlideElement.style.width = "100%";
    currentSlideElement.style.height = "100%";
    currentSlideElement.style.transition = `left ${transitionDuration}ms ease-in-out`;

    nextSlideElement.offsetHeight;

    requestAnimationFrame(() => {
      currentSlideElement.style.left = "-100%";
      nextSlideElement.style.left = "0";
    });

    setTimeout(() => {
      if (currentSlideElement.parentNode === carouselContainer) {
        carouselContainer.removeChild(currentSlideElement);
      }

      nextSlideElement.style.position = "relative";
      nextSlideElement.style.left = "0";
      nextSlideElement.style.width = "";
      nextSlideElement.style.height = "";
      nextSlideElement.style.transition = "";

      currentProjectIndex = nextProjectIndex;
      isTransitioning = false;
    }, transitionDuration);
  }

  function prevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    const prevProjectIndex = (currentProjectIndex - 1 + sortedProjects.length) % sortedProjects.length;
    const prevProject = sortedProjects[prevProjectIndex];

    const prevSlideElement = createSlide(prevProject);
    carouselContainer.appendChild(prevSlideElement);

    prevSlideElement.style.position = "absolute";
    prevSlideElement.style.top = "0";
    prevSlideElement.style.left = "-100%";
    prevSlideElement.style.width = "100%";
    prevSlideElement.style.height = "100%";
    prevSlideElement.style.transition = `left ${transitionDuration}ms ease-in-out`;

    const currentSlideElement = carouselContainer.children[0];
    currentSlideElement.style.position = "absolute";
    currentSlideElement.style.top = "0";
    currentSlideElement.style.left = "0";
    currentSlideElement.style.width = "100%";
    currentSlideElement.style.height = "100%";
    currentSlideElement.style.transition = `left ${transitionDuration}ms ease-in-out`;

    prevSlideElement.offsetHeight;

    requestAnimationFrame(() => {
      currentSlideElement.style.left = "100%";
      prevSlideElement.style.left = "0";
    });

    setTimeout(() => {
      if (currentSlideElement.parentNode === carouselContainer) {
        carouselContainer.removeChild(currentSlideElement);
      }

      prevSlideElement.style.position = "relative";
      prevSlideElement.style.left = "0";
      prevSlideElement.style.width = "";
      prevSlideElement.style.height = "";
      prevSlideElement.style.transition = "";

      currentProjectIndex = prevProjectIndex;
      isTransitioning = false;
    }, transitionDuration);
  }

  function startAutoPlay() {
    if (intervalId || manualControlUsed) return; // Ne pas redémarrer si contrôles manuels utilisés
    intervalId = setInterval(nextSlide, slideInterval);
  }

  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function handleManualControl(direction) {
    // Arrêter définitivement l'autoplay lors de la première interaction manuelle
    if (!manualControlUsed) {
      manualControlUsed = true;
      stopAutoPlay();
    }

    if (direction === "next") {
      nextSlide();
    } else if (direction === "prev") {
      prevSlide();
    }
  }

  // Pause sur focus pour l'accessibilité
  carouselContainer.addEventListener("focusin", stopAutoPlay);
  carouselContainer.addEventListener("focusout", () => {
    if (!manualControlUsed) {
      startAutoPlay();
    }
  });

  // Connecter les boutons de contrôle
  const prevButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");

  if (prevButton) {
    prevButton.addEventListener("click", () => handleManualControl("prev"));
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => handleManualControl("next"));
  }

  // Démarrer l'auto-play
  startAutoPlay();
}

document.addEventListener("DOMContentLoaded", loadCarousel);
