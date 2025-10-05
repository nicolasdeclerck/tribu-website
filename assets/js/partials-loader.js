// Fonction pour charger les partials
async function loadPartials() {
  try {
    // Charge header et footer en parallèle
    const [headerResponse, footerResponse] = await Promise.all([
      fetch("/partials/header.html"),
      fetch("/partials/footer.html"),
    ]);

    const [headerData, footerData] = await Promise.all([
      headerResponse.text(),
      footerResponse.text(),
    ]);

    // Insert header
    document.querySelector("header").innerHTML = headerData;

    // Insert footer
    document.querySelector("footer").innerHTML = footerData;

    // Initialise le menu
    initMenu();

    // Affiche le contenu avec un petit délai pour la fluidité
    requestAnimationFrame(() => {
      document.body.classList.remove("opacity-0");
      document.body.classList.add("opacity-100");
    });
  } catch (error) {
    console.error("Erreur de chargement des partials:", error);
    // Affiche quand même le contenu en cas d'erreur
    document.body.classList.remove("opacity-0");
    document.body.classList.add("opacity-100");
  }
}

function initMenu() {
  const menuButton = document.querySelector('[data-action="open-menu"]');
  const menu = document.querySelector('nav[data-device="mobile"]');

  if (menuButton && menu) {
    menuButton.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("hidden");
      menu.classList.toggle("block");
    });

    document.addEventListener("click", (e) => {
      if (!menuButton.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add("hidden");
        menu.classList.remove("block");
      }
    });

    const menuLinks = menu.querySelectorAll("a");
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.add("hidden");
        menu.classList.remove("block");
      });
    });
  }
}

// Lance le chargement dès que le DOM est prêt
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadPartials);
} else {
  loadPartials();
}
