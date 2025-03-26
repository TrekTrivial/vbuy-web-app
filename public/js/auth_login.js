document.querySelector(".login-btn-form").addEventListener("click", async e => {
  e.preventDefault();

  if (!validateLoginData()) {
    return;
  }

  const credentials = {
    userID: user_ID.value,
    password: password.value,
  };
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      alert("Logged in");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  } catch (e) {
    console.error(e);
    alert("Something went wrong");
  }
});
