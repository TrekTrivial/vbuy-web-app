"use strict";

const subject = document.querySelector(".subject");
const issue = document.querySelector(".issue");

const validateTicketData = () => {
  var isValid = true;

  if (subject.value == "" || issue.value == "") {
    isValid = false;
  }
  return isValid;
};

document.querySelector(".support-btn").addEventListener("click", async e => {
  e.preventDefault();

  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  if (!validateTicketData()) {
    alert("Invalid ticket data!");
    return;
  }

  const ticket = {
    issueSubject: subject.value,
    issueMessage: issue.value,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/support/raise`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticket),
    });

    const data = response.json();

    if (response.ok) {
      alert("Support ticket created!");
      window.location.href = "/support";
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong!");
  }
});
