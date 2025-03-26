"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/carts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!data.result[0]) {
      alert("Cart is empty");
      return;
    }

    if (response.ok) {
      await createCartTable(data.result[0]);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});

const createCartTable = async data => {
  const { cartID, userID, isbn, quantity, costPrice, cartTotal, cartStatus } =
    data;

  document.querySelector(".cart-id").innerHTML = `${cartID}`;

  const table = document.querySelector(".cart-table");
  const length = isbn.length;

  try {
    for (var i = 0; i < length; ++i) {
      const row = table.insertRow();

      const cell0 = row.insertCell();
      cell0.textContent = i + 1;

      const cell1 = row.insertCell();
      cell1.textContent = isbn[i];
      cell1.classList.add("isbn");

      const result = await fetch(`${API_BASE_URL}/calculator/book/${isbn[i]}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const bookData = await result.json();

      if (result.ok) {
        const cell2 = row.insertCell();
        cell2.textContent = bookData.book.title;
        cell2.classList.add("title");
      } else {
        alert("Could not find book name");
      }
      const cell3 = row.insertCell();
      cell3.textContent = quantity[i];
      cell3.classList.add("quantity");

      const cell4 = row.insertCell();
      cell4.textContent = bookData.book.mrp ? bookData.book.mrp : "N/A";
      cell4.classList.add("mrp");

      const cell5 = row.insertCell();
      cell5.textContent = costPrice[i] ? costPrice[i] : 0;
      cell5.classList.add("cost-price");

      const cell6 = row.insertCell();
      cell6.textContent = costPrice[i] * quantity[i];
      cell6.classList.add("cart-total-val");

      const cell7 = row.insertCell();
      const anchor = document.createElement("a");
      anchor.textContent = "✗";
      anchor.href = "";
      anchor.classList.add("remove-link");
      cell7.appendChild(anchor);
    }

    document.querySelector(".cart-total").innerHTML = cartTotal;

    attachRemoveEventListeners();
  } catch (e) {
    throw new Error(e.message);
  }
};

const attachRemoveEventListeners = () => {
  const removeLinks = document.querySelectorAll(".remove-link");

  removeLinks.forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();

      const token = getTokenFromCookies();
      if (!token) {
        alert("Unauthorized!");
        return;
      }

      const row = e.target.closest("tr");
      const isbn = row.querySelector(".isbn").textContent; // Extract ISBN
      const price = parseFloat(row.querySelector(".cost-price").textContent);
      const quantity = parseInt(row.querySelector(".quantity").textContent);
      const itemTotal = price * quantity;

      try {
        const response = await fetch(`${API_BASE_URL}/carts/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isbn }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Book removed from cart");

          if (row) row.remove(); // Remove the specific row

          // Update cart total
          const cartTotalElement = document.querySelector(".cart-total");
          let currentTotal = parseFloat(cartTotalElement.textContent) || 0;
          const newTotal = Math.max(currentTotal - itemTotal, 0);
          cartTotalElement.textContent = newTotal.toFixed(2);

          // Get table body and check number of remaining rows
          const tableBody = document.querySelector(".cart-table tbody");
          if (!tableBody || tableBody.rows.length === 0) {
            cartTotalElement.textContent = "0.00";
            document.querySelector(".cart-id").textContent = "N/A";
          }
        } else {
          alert(data.message || "Failed to remove book");
        }
      } catch (err) {
        console.error(err.message);
        alert("Something went wrong");
      }
    });
  });
};

document.querySelector(".order-btn").addEventListener("click", async e => {
  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  const table = document.querySelector(".cart-table");
  const rows = table.rows.length;

  if (rows === 0) {
    alert("Cart is empty");
    return;
  }

  const orderDetails = {
    order_id: "98856725",
    order_date: "2025-03-24 11:11",
    pickup_location: "Home",
    channel_id: "",
    comment: "Reseller: M/s Goku",
    billing_customer_name: "Naruto",
    billing_last_name: "Uzumaki",
    billing_address: "House 221B, Leaf Village",
    billing_address_2: "Near Hokage House",
    billing_city: "New Delhi",
    billing_pincode: "110002",
    billing_state: "Delhi",
    billing_country: "India",
    billing_email: "naruto@uzumaki.com",
    billing_phone: "9876543210",
    shipping_is_billing: true,
    shipping_customer_name: "",
    shipping_last_name: "",
    shipping_address: "",
    shipping_address_2: "",
    shipping_city: "",
    shipping_pincode: "",
    shipping_country: "",
    shipping_state: "",
    shipping_email: "",
    shipping_phone: "",
    order_items: [
      {
        name: "Kunai",
        sku: "chakra123",
        units: 10,
        selling_price: "900",
        discount: "",
        tax: "",
        hsn: 441122,
      },
    ],
    payment_method: "Prepaid",
    shipping_charges: 0,
    giftwrap_charges: 0,
    transaction_charges: 0,
    total_discount: 0,
    sub_total: 9000,
    length: 10,
    breadth: 15,
    height: 20,
    weight: 2.5,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderDetails),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Order created!");
      window.location.href = "order.html";
    } else {
      alert("Empty cart");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});
