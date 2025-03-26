"use strict";

const userID = document.querySelector(".user-id");
const firstName = document.querySelector(".firstName");
const lastName = document.querySelector(".lastName");
const email = document.querySelector(".email");
const password1 = document.querySelector(".password1");
const password2 = document.querySelector(".password2");
const phoneNumber = document.querySelector(".phone-number");
const street = document.querySelector(".street");
const city = document.querySelector(".city");
const state = document.querySelector(".state");
const pincode = document.querySelector(".pincode");

document.addEventListener("DOMContentLoaded", async () => {
  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  try {
    // Fetch user profile
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Invalid response format: Not JSON");
    }

    const data = await response.json();
    console.log("User Data:", data);

    // Fetch user address
    const result = await fetch(`${API_BASE_URL}/user/profile/address`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const addressContentType = result.headers.get("content-type");
    if (
      !addressContentType ||
      !addressContentType.includes("application/json")
    ) {
      throw new Error("Invalid address response format: Not JSON");
    }

    const user = await result.json();
    console.log("Address Data:", user);

    // Populate fields
    userID.value = data.userID;
    firstName.value = data.firstName;
    lastName.value = data.lastName;
    email.value = data.email;
    phoneNumber.value = data.mobile_no;
    street.value = user.street;
    city.value = user.city;
    state.value = user.state_;
    pincode.value = user.pincode;
  } catch (err) {
    console.error("Error fetching user data:", err);
    alert("Something went wrong while loading user data.");
  }
});

document.querySelector(".otp-btn-reg").addEventListener("click", async e => {
  e.preventDefault();

  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  if (!validateData()) {
    return;
  }

  const user = {
    email: email.value,
    passwd: password1.value,
    mobile_no: phoneNumber.value,
  };

  const address = {
    street: street.value,
    city: city.value,
    state_: state.value,
    pincode: pincode.value,
  };

  try {
    // Update user info
    const response = await fetch(`${API_BASE_URL}/user/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    console.log(response);

    const result = await fetch(`${API_BASE_URL}/user/update/address`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    });

    console.log(result);

    // Check if both updates were successful
    if (response.ok && result.ok) {
      alert("User updated successfully!");
      window.location.href = "dashboard.html";
    } else {
      alert("Error updating user information.");
    }
  } catch (err) {
    console.error("Error updating user:", err);
    alert("Something went wrong while updating user data.");
  }
});

// Email Validation Regex
const validEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validateData = () => {
  let isValid = true;

  if (email.value === "" || !email.value.match(validEmailRegex)) {
    document.querySelector(".email-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".email-error").setAttribute("hidden", "");
  }

  if (password1.value.length < 8) {
    document.querySelector(".pass1-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".pass1-error").setAttribute("hidden", "");
  }

  if (phoneNumber.value.length < 10 || isNaN(Number(phoneNumber.value))) {
    document.querySelector(".phone-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".phone-error").setAttribute("hidden", "");
  }

  if (street.value === "") {
    document.querySelector(".street-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".street-error").setAttribute("hidden", "");
  }

  if (city.value === "") {
    document.querySelector(".city-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".city-error").setAttribute("hidden", "");
  }

  if (state.value === "") {
    document.querySelector(".state-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".state-error").setAttribute("hidden", "");
  }

  if (
    pincode.value === "" ||
    pincode.value.length !== 6 ||
    isNaN(Number(pincode.value))
  ) {
    document.querySelector(".pincode-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".pincode-error").setAttribute("hidden", "");
  }

  return isValid;
};

document.querySelector(".del-btn").addEventListener("click", async e => {
  e.preventDefault();

  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/user/delete`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      alert("Account deleted");
      window.location.href = "index.html";
    } else {
      alert("Not deleted");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});
