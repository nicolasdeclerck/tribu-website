// insert footer.html into footer tags
fetch("/partials/footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.querySelector("footer").innerHTML = data;
  });
