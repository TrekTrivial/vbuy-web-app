"use strict";

const API_BASE_URL = "http://localhost:5000";

document.querySelector(".otp-btn").addEventListener("click", async e => {
  e.preventDefault();

  if (!validateRegisterFormData()) {
    return;
  }

  const dataForOTP = {
    name: firstName.value,
    email: email.value,
  };

  try {
    console.log("hi");
    const response = await fetch(`${API_BASE_URL}/user/request_otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataForOTP),
    });

    console.log(response);
    const data = await response.json();

    if (response.ok) {
      document.querySelector(".otp").removeAttribute("disabled");
      document.querySelector(".otp-btn-res").removeAttribute("disabled");
      document.querySelector(".otp-btn-reg").removeAttribute("disabled");
    } else {
      alert(data.message);
    }
  } catch (e) {
    console.error(e);
    alert("Something went wrong");
  }
});

document.querySelector(".otp-btn-reg").addEventListener("click", async e => {
  e.preventDefault();

  if (!validateOTPfromForm) {
    return;
  }

  const user = {
    userID: userID.value,
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password1.value,
    mobile_no: phoneNumber.value,
    street: street.value,
    city: city.value,
    state_: state.value,
    pincode: pincode.value,
    otp: otp.value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (response.ok) {
      document.cookie = `token=${data.token}; path=/; max-age=86400; SameSite=Strict`;
      alert("Registered");
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  } catch (e) {
    console.error(e);
    alert("Something went wrong");
  }
});
