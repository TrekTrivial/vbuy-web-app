CREATE TABLE IF NOT EXISTS USERS (
    userID INT NOT NULL,
    firstName VARCHAR(25) NOT NULL,
    lastName VARCHAR(25) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    passwd VARCHAR(72) NOT NULL,
    mobile_no VARCHAR(10) NOT NULL,
    tokens JSON NOT NULL,
    PRIMARY KEY (userID)
);

CREATE TABLE IF NOT EXISTS USER_ADDRESS (
    addressID INT NOT NULL,
    userID INT NOT NULL,
    street VARCHAR(30) NOT NULL,
    city VARCHAR(30) NOT NULL,
    state_ VARCHAR(30) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    PRIMARY KEY (addressID),
    FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BOOKS (
    isbn VARCHAR(13) NOT NULL,
    title VARCHAR(50) NOT NULL,
    author VARCHAR(30) NOT NULL,
    publication VARCHAR(50) NOT NULL,
    edition_ VARCHAR(2) NOT NULL,
    mrp DECIMAL NOT NULL,
    costPrice DECIMAL NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY (isbn)
);

CREATE TABLE IF NOT EXISTS CART (
    cartID INT NOT NULL,
    userID INT NOT NULL,
    isbn JSON NOT NULL,
    quantity INT NOT NULL,
    cartTotal DECIMAL NOT NULL,
    cartStatus ENUM('empty', 'full') NOT NULL,
    PRIMARY KEY (cartID),
    FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ORDERS (
    orderID INT NOT NULL,
    userID INT NOT NULL,
    cartID INT NOT NULL,
    orderTotal DECIMAL NOT NULL,
    orderDate DATE NOT NULL,
    orderStatus ENUM('confirmed', 'completed', 'cancelled', 'returned') NOT NULL,
    PRIMARY KEY (orderID),
    FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE,
    FOREIGN KEY (cartID) REFERENCES CART(cartID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PAYMENTS (
    transactionID INT NOT NULL,
    userID INT NOT NULL,
    orderID INT NOT NULL,
    paymentStatus ENUM('failed', 'completed', 'under process'),
    PRIMARY KEY (transactionID),
    FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE,
    FOREIGN KEY (orderID) REFERENCES ORDERS(orderID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS BANK_ACCOUNT (
    accountNumber VARCHAR(30) NOT NULL,
    ifsc VARCHAR(11) NOT NULL,
    bank VARCHAR(20) NOT NULL,
    accountHolderName VARCHAR(30) NOT NULL,
    transactionID INT NOT NULL,
    userID INT NOT NULL,
    PRIMARY KEY (accountNumber),
    FOREIGN KEY (transactionID) REFERENCES PAYMENTS(transactionID) ON DELETE CASCADE,
    FOREIGN KEY (userID) REFERENCES USERS(userID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SHIPPING (
    shippingID INT NOT NULL,
    orderID INT NOT NULL,
    addressID INT NOT NULL,
    shippingStatus ENUM('Picked up', 'In transit', 'Delivered', 'Under review') NOT NULL,
    PRIMARY KEY (shippingID),
    FOREIGN KEY (orderID) REFERENCES ORDERS(orderID) ON DELETE CASCADE,
    FOREIGN KEY (addressID) REFERENCES USER_ADDRESS(addressID) ON DELETE CASCADE
);