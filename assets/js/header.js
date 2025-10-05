// insert header.html into header tags
fetch("/partials/header.html")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector("header").innerHTML = data;

    const menuButton = document.querySelector('[data-action="open-menu"]');
    const menu = document.querySelector('nav[data-device="mobile"]');

    if (menuButton && menu) {
      // Toggle menu on button click
      menuButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Empêche la propagation pour ne pas déclencher le click sur document
        menu.classList.toggle("hidden");
        menu.classList.toggle("block");
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        // Vérifie si le clic est en dehors du menu et du bouton
        if (!menuButton.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.add("hidden");
          menu.classList.remove("block");
        }
      });

      // Optionnel : fermer le menu sur les liens cliqués
      const menuLinks = menu.querySelectorAll("a");
      menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          menu.classList.add("hidden");
          menu.classList.remove("block");
        });
      });
    }
  });

// insert footer.html into footer tags
fetch("/partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector("footer").innerHTML = data;
  });
