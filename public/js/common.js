const API_BASE_URL = "http://localhost:5000";

function getTokenFromCookies() {
  let cookies = document.cookie.split("; ");
  for (let cookie of cookies) {
    let [name, value] = cookie.split("=");
    if (name === "token") return value;
  }
  return null;
}
