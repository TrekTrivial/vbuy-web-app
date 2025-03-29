function loadComponent(component, file) {
  fetch(file)
    .then(response => response.text())
    .then(data => {
      document.getElementById(component).innerHTML = data;
    });
}

window.onload = function () {
  loadComponent("header-container", "header.html");
  loadComponent("footer-container", "footer.html");
};
