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
const termsCheck = document.querySelector(".terms");
const otp = document.querySelector(".otp");

const validEmailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validateRegisterFormData = () => {
  var isValid = true;
  if (userID.value == "" || isNaN(Number(userID.value))) {
    document.querySelector(".user-id-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".user-id-error").setAttribute("hidden", "");
  }

  if (firstName.value == "") {
    document.querySelector(".fname-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".fname-error").setAttribute("hidden", "");
  }

  if (lastName.value == "") {
    document.querySelector(".lname-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".lname-error").setAttribute("hidden", "");
  }

  if (email.value == "" || !email.value.match(validEmailRegex)) {
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

  if (password2.value.length < 8) {
    document.querySelector(".pass2-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".pass2-error").setAttribute("hidden", "");
  }

  if (password1.value !== password2.value) {
    document.querySelector(".pass1-error").removeAttribute("hidden");
    document.querySelector(".pass2-error").removeAttribute("hidden");
    isValid = false;
  } else if (password1.value === password2.value) {
    if (password1.value.length >= 8 || password2.value.length >= 8) {
      document.querySelector(".pass1-error").setAttribute("hidden", "");
      document.querySelector(".pass2-error").setAttribute("hidden", "");
    } else {
      document.querySelector(".pass1-error").removeAttribute("hidden");
      document.querySelector(".pass2-error").removeAttribute("hidden");
      isValid = false;
    }
  }

  if (phoneNumber.value.length < 10 || isNaN(Number(phoneNumber.value))) {
    document.querySelector(".phone-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".phone-error").setAttribute("hidden", "");
  }

  if (street.value == "") {
    document.querySelector(".street-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".street-error").setAttribute("hidden", "");
  }

  if (city.value == "") {
    document.querySelector(".city-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".city-error").setAttribute("hidden", "");
  }

  if (state.value == "") {
    document.querySelector(".state-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".state-error").setAttribute("hidden", "");
  }

  if (
    pincode.value == "" ||
    pincode.value.length !== 6 ||
    isNaN(Number(pincode.value))
  ) {
    document.querySelector(".pincode-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".pincode-error").setAttribute("hidden", "");
  }

  if (!termsCheck.checked) {
    document.querySelector(".terms-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".terms-error").setAttribute("hidden", "");
  }
  return isValid;
};

const validateOTPfromForm = () => {
  var isValid = true;

  if (otp.value.length !== 6 || isNaN(Number(otp.value))) {
    document.querySelector(".otp-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".otp-error").setAttribute("hidden", "");
  }

  return isValid;
};
