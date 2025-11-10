async function loadCarousel() {
  try {
    const response = await fetch("/projets/projets_data.json");
    const projects = await response.json();

    const slidesContainer = document.querySelector(".glide__slides");

    if (!slidesContainer) {
      console.error("Conteneur des slides non trouvé");
      return;
    }

    slidesContainer.innerHTML = "";

    const sortedProjects = projects.sort(
      (a, b) => (a.ordre || 0) - (b.ordre || 0)
    );

    if (sortedProjects.length === 0) {
      console.error("Aucun projet trouvé");
      return;
    }

    sortedProjects.forEach((project) => {
      const slide = createSlide(project);
      slidesContainer.appendChild(slide);
    });

    initGlideCarousel();
  } catch (error) {
    console.error("Erreur lors du chargement des projets:", error);
  }
}

function createSlide(project) {
  const slide = document.createElement("li");
  slide.className = "glide__slide h-full bg-cover bg-center relative p-4";
  slide.style.backgroundImage = `url('${project.background_image}')`;

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

function initGlideCarousel() {
  const glideElement = document.querySelector(".glide");

  if (!glideElement) {
    console.error("Élément Glide non trouvé");
    return;
  }

  let manualControlUsed = false;

  const glide = new Glide(".glide", {
    type: "carousel",
    autoplay: 5000,
    animationDuration: 500,
    hoverpause: false,
    keyboard: true,
    perView: 1,
    gap: 0,
  });

  const arrows = glideElement.querySelectorAll("[data-glide-dir]");
  arrows.forEach((arrow) => {
    arrow.addEventListener("click", function () {
      if (!manualControlUsed) {
        manualControlUsed = true;
        glide.update({ autoplay: false });
      }
    });
  });

  document.addEventListener("keydown", function (event) {
    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      !manualControlUsed
    ) {
      manualControlUsed = true;
      glide.update({ autoplay: false });
    }
  });

  glideElement.addEventListener("focusin", function () {
    if (!manualControlUsed && glide.settings.autoplay) {
      glide.pause();
    }
  });

  glideElement.addEventListener("focusout", function () {
    if (!manualControlUsed && glide.settings.autoplay) {
      glide.play();
    }
  });

  glide.mount();
}

document.addEventListener("DOMContentLoaded", loadCarousel);
