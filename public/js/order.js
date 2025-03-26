"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const token = getTokenFromCookies();
  if (!token) {
    alert("Unauthorized!");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!data) {
      alert("No orders placed");
      return;
    }

    if (response.ok) {
      await createOrderTable(data, token);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
});

const createOrderTable = async (data, token) => {
  const length = data.length;
  const table = document.querySelector(".order-table");
  try {
    for (var i = 0; i < length; ++i) {
      const row = table.insertRow();

      const cell0 = row.insertCell();
      cell0.textContent = i + 1;

      const cell1 = row.insertCell();
      cell1.textContent = data[i].orderID;

      const cell2 = row.insertCell();
      cell2.textContent = data[i].cartID ? data[i].cartID : "N/A";

      const cell3 = row.insertCell();
      cell3.textContent = data[i].item_count;

      const cell4 = row.insertCell();
      cell4.textContent = data[i].orderTotal;

      const date = data[i].orderDate.split(" ")[1] + " ";
      data[i].orderDate.split(" ")[2] + " ";
      data[i].orderDate.split(" ")[3];

      const cell5 = row.insertCell();
      cell5.textContent = date;

      const cell6 = row.insertCell();
      cell6.textContent = data[i].orderStatus;

      const result = await fetch(
        `${API_BASE_URL}/orders/shipping/${data[i].orderID}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const orderData = await result.json();

      console.log(orderData);

      if (result.ok) {
        const cell7 = row.insertCell();
        cell7.textContent = orderData[0].shippingID
          ? orderData[0].shippingID
          : "N/A";

        const cell8 = row.insertCell();
        cell8.textContent = orderData[0].AWBnumber
          ? orderData[0].AWBnumber
          : "N/A";
      }

      const result2 = await fetch(
        `${API_BASE_URL}/orders/invoice/${data[i].orderID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const invoice = await result2.json();

      const cell9 = row.insertCell();
      if (result2.ok) {
        const anchor1 = document.createElement("a");
        anchor1.textContent = "⭳";
        anchor1.href = `${invoice.invoice_url}`;
        anchor1.classList.add("remove-link");
        cell9.appendChild(anchor1);
      } else {
        cell9.textContent = "N/A";
      }

      const cell10 = row.insertCell();
      cell10.textContent = orderData.shippingStatus
        ? orderData.shippingStatus
        : "N/A";

      const cell11 = row.insertCell();
      const anchor = document.createElement("a");
      anchor.textContent = "✗";
      anchor.href = "";
      anchor.classList.add("remove-link");
      cell11.appendChild(anchor);
    }

    attachRemoveEventListeners(data);
  } catch (e) {
    throw new Error(e.message);
  }
};

const attachRemoveEventListeners = orderID => {
  const removeLinks = document.querySelectorAll(".remove-link");

  removeLinks.forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();

      const token = getTokenFromCookies();
      if (!token) {
        alert("Unauthorized!");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/orders/cancel/${orderID}`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Order cancelled");

          const row = e.target.closest("tr");
          if (row) row.remove();
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
