const password = document.querySelector(".password");
const user_ID = document.querySelector(".userID");

const validateLoginData = () => {
  var isValid = true;

  if (user_ID.value == "") {
    document.querySelector(".userid-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".userid-error").setAttribute("hidden", "");
  }
  if (password.value == "") {
    document.querySelector(".pass-error").removeAttribute("hidden");
    isValid = false;
  } else {
    document.querySelector(".pass-error").setAttribute("hidden", "");
  }
  return isValid;
};
