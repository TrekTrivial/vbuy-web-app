# VBuy - Give Your Old Books A New Life

**VBuy** is a full-stack web application designed to provide a hassle-free solution for selling used books online. It eliminates the traditional "list-and-wait" model, offering users a fair price and a seamless selling experience with zero shipping charges.

## Live Demo
**[Visit VBuy](https://vbuy.onrender.com)**

---

## Problem Statement
While researching the market, we found that existing platforms often offer unfair prices for used books or charge high shipping fees that eat into the profit. Additionally, most platforms rely on a model where sellers must wait indefinitely for a buyer to contact them, leading to uncertainty.

## The Solution
VBuy provides a platform where users can instantly sell their books to us rather than waiting for a third-party buyer.
* **Fair Pricing:** A custom algorithm calculates the best second-hand price based on current trends.
* **Zero Shipping Cost:** Users can place an order, and the books are picked up free of cost.
* **Instant Selling:** No negotiation needed; simply add to cart and place the order.

---

## Technology Stack

### Frontend
* **HTML5 & CSS3:** For content structure and styling.
* **JavaScript (DOM):** For dynamic client-side interactions.

### Backend
* **Node.js:** Primary backend environment.
* **Express.js:** Web server framework and API routing.

### Database
* **MySQL:** Relational database for structured data storage.
* **Custom RDBMS Schema:** Implemented a custom-designed relational schema to handle dynamic data relationships effectively.
* **Aiven.io:** Cloud MySQL service provider.

### Hosting & Security
* **Render:** Web application hosting service.
* **JWT (JSON Web Tokens):** Implemented for secure user authentication.
* **OTP Verification:** Email verification using One-Time Passwords for enhanced account security.

---

## Architecture & APIs

The project follows a **Layered Architecture** divided into Presentation, Application, and Data Access layers.

### Custom Internal APIs
The application relies on several self-built RESTful APIs to handle core logic:
* **User Management:** Handles registration, login, and account updates.
* **Order Management:** Manages order creation and tracking.
* **Warehouse Management:** Tracks book inventory and stock levels.
* **Customer Service:** Manages support chat functionality.

### External Integrations
* **Google Books API:** Fetches accurate book details (Title, Author, etc.) during the listing process.
* **Shiprocket API:** Handles shipping service integration for pickups.

---

## Database Design
The project features a **custom RDBMS schema** designed to maintain data integrity across key entities:
* **USERS:** Stores user IDs, contact info, and credentials.
* **CART:** Temporary storage for books a user intends to sell.
* **ORDERS:** Tracks order status, shipping IDs, and dates.
* **BOOKS:** Inventory data including ISBN, author, and calculated cost price.

---

## Future Scope
Currently, VBuy operates on a "sell-only" model. Future versions aim to introduce a buying feature, allowing users to purchase second-hand books directly from the platform.

---

