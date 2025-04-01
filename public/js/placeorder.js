"use strict";

async function makeCartTable(cart) {
  const table = document.querySelector(".items-table");

  const len = cart.isbn.length;

  try {
    for (let i = 0; i < len; ++i) {
      const row = document.createElement("tr");

      const isbn = cart.isbn[i];

      const response = await fetch(`${API_BASE_URL}/orders/book/${isbn}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error");
      }

      const details = await response.json();

      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${isbn}</td>
        <td>${details.title}, ${details.authors}</td>
        <td>${cart.costPrice[i]}</td>
        <td>${cart.quantity[i]}</td>
        <td>${cart.costPrice[i] * cart.quantity[i]}</td>
    `;
      table.appendChild(row);
    }
  } catch (e) {
    console.error(e);
  }
}

function getFormattedDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

document.addEventListener("DOMContentLoaded", async () => {
  const token = getTokenFromCookies();
  try {
    const response = await fetch(`${API_BASE_URL}/user/profile/address`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error");
    }

    const data = await response.json();
    document.querySelector(
      ".address"
    ).innerHTML = `${data.street}, ${data.city}, ${data.state}, ${data.pincode}`;

    const response1 = await fetch(`${API_BASE_URL}/orders/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response1.ok) {
      throw new Error("Error");
    }

    const data1 = await response1.json();

    await makeCartTable(data1[0]);

    let totalItems = 0;
    data1[0].quantity.forEach(num => (totalItems += num));

    document.querySelector(".order-count").innerHTML = totalItems;
    document.querySelector(".order-total").innerHTML = data1[0].cartTotal;
    document.querySelector(".cart-id").innerHTML = data1[0].cartID;
  } catch (e) {
    console.error(e);
  }
});

document
  .querySelector(".place-order-btn")
  .addEventListener("click", async e => {
    e.preventDefault();

    try {
      const response1 = await fetch(`${API_BASE_URL}/user/`);
    } catch (err) {
      console.error(err);
    }

    const orderDetails = {
      order_id: "qweqweqwe",
      order_date: getFormattedDateTime(),
      pickup_location: "Home",
      channel_id: "",
      comment: "Test order",
      billing_customer_name: "Naruto",
      billing_last_name: "Uzumaki",
      billing_address: "House 221B, Leaf Village",
      billing_address_2: "Near Hokage House",
      billing_city: "New Delhi",
      billing_pincode: 110002,
      billing_state: "Delhi",
      billing_country: "India",
      billing_email: "naruto@uzumaki.com",
      billing_phone: "9876543210",
      shipping_is_billing: false,
      shipping_customer_name: "VBuy",
      shipping_last_name: "",
      shipping_address: "SGSITS College",
      shipping_address_2: "",
      shipping_city: "Indore",
      shipping_pincode: "452003",
      shipping_country: "India",
      shipping_state: "Madhya Pradesh",
      shipping_email: "vbuy@gmail.com",
      shipping_phone: "9999999999",
      order_items,
      payment_method: "Prepaid",
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: 9000,
      length: 10,
      breadth: 10,
      height: 20,
      weight: 1,
    };
  });
