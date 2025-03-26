"use strict";

const isbnData = document.querySelector(".isbn");

const validateISBN = () => {
  var isValid = true;
  if (isbnData.value.length !== 13 || isNaN(Number(isbnData.value))) {
    isValid = false;
  }
  return isValid;
};

document
  .querySelector(".sell-submit-btn")
  .addEventListener("click", async e => {
    e.preventDefault();

    const token = getTokenFromCookies();
    if (!token) {
      alert("Unauthorized!");
      return;
    }

    if (!validateISBN()) {
      alert("Invalid ISBN!");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/calculator/book/${isbnData.value}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (response.ok) {
        addToCart(data.book, token);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  });

const addToCart = async (data, token) => {
  var { isbn, costPrice } = data;
  if (costPrice == null) costPrice = 0;

  console.log(costPrice);
  const bookData = {
    isbn,
    quantity: 1,
    costPrice,
  };

  try {
    const newresponse = await fetch(`${API_BASE_URL}/carts/additem`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    const result = await newresponse.json();

    if (newresponse.ok) {
      alert("Added to cart");
      window.location.href = "cart.html";
    }
  } catch (e) {
    throw new Error(e.message);
  }
};
