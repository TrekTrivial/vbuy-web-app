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

document.addEventListener("DOMContentLoaded", () => {
  const token = getTokenFromCookies();

  if (token) {
    document.querySelector(".dashboard").style.display = "flex";
    document.querySelector(".log-reg").style.display = "none";
  } else {
    document.querySelector(".dashboard").style.display = "none";
    document.querySelector(".log-reg").style.display = "flex";
  }
});
