"use strict";

function makeCartTable(cart) {
  const table = document.querySelector(".cart-table");

  const len = cart.isbn.length;

  for (let i = 0; i < len; ++i) {
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${i + 1}</td>
    <td>${cart.isbn[i]}</td>
    <td>test</td>
    <td>test</td>
    <td>${cart.quantity[i]}</td>
    <td>test</td>
    <td>${cart.costPrice[i]}</td>
    <td>${cart.quantity[i] * cart.costPrice[i]}</td>
    <td><a href="" data-isbn=${cart.isbn[i]} class="remove-btn">&cross;</a></td>
`;
    table.appendChild(row);
  }
}

document.addEventListener("DOMContentLoaded", async e => {
  const token = getTokenFromCookies();

  try {
    const response = await fetch(`${API_BASE_URL}/carts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error");
    }

    if (data.length === 1) {
      makeCartTable(data[0]);
      document.querySelector(".cart-id").innerHTML = `${data[0].cartID}`;
      document.querySelector(
        ".cart-value"
      ).innerHTML = `Rs. ${data[0].cartTotal}.00`;
    } else {
      document.querySelector(".empty-cart").style.display = "block";
      document.querySelector(".sub-cart-container").style.display = "none";
    }
  } catch (err) {
    console.error(err);
  }
});

document.querySelector(".del-cart-btn").addEventListener("click", async e => {
  e.preventDefault();

  const cartID = document.querySelector(".cart-id").innerHTML;
  const token = getTokenFromCookies();

  try {
    const response = await fetch(`${API_BASE_URL}/carts/delete/${cartID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error");
    }

    const data = await response.json();
    alert("Cart deleted!");
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
});

const removeFromCart = async isbn => {
  const token = getTokenFromCookies();

  const cartID = document.querySelector(".cart-id").innerHTML;
  const body = {
    isbn,
    cartID,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/carts/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error");
    }

    window.location.reload();
  } catch (err) {
    console.error(err);
  }
};

document.querySelector(".cart-table").addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-btn")) {
    e.preventDefault();

    const isbn = e.target.getAttribute("data-isbn");
    removeFromCart(isbn);
  }
});
