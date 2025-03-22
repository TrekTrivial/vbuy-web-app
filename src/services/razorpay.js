const Razorpay = require("razorpay");
const { returnOrder } = require("./shiprocket");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (amount, currency = "INR") => {
  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (e) {
    throw new Error(e);
  }
};

const getOrder = async order_id => {
  try {
    const order = await razorpay.orders.fetch(order_id);
    return order;
  } catch (e) {
    throw new Error(e);
  }
};

const getPayments = async order_id => {
  try {
    const payments = await razorpay.orders.fetchPayments(order_id);
    return payments;
  } catch (e) {
    throw new Error(e);
  }
};

const getPaymentByID = async payment_id => {
  try {
    const payment = await razorpay.payments.fetch(payment_id);
    return payment;
  } catch (e) {
    throw new Error(e);
  }
};

const createRefund = async (payment_id, amount) => {
  const options = {
    amount: amount,
    speed: "normal",
  };

  try {
    const refundOrder = await razorpay.payments.refund(payment_id, options);
    return refundOrder;
  } catch (e) {
    throw new Error(e);
  }
};

const getRefunds = async payment_id => {
  try {
    const refunds = await razorpay.payments.fetchMultipleRefund(payment_id);
    return refunds;
  } catch (e) {
    throw new Error(e);
  }
};

const getRefundByID = async (payment_id, refund_id) => {
  try {
    const refund = await razorpay.payments.fetchRefund(payment_id, refund_id);
    return refund;
  } catch (e) {
    throw new Error(e);
  }
};

const createCustomer = async (name, mobile_no, email) => {
  const options = {
    name: name,
    contact: mobile_no,
    email: email,
    fail_existing: 0,
  };

  try {
    const customer = await razorpay.customers.create(options);
    return customer;
  } catch (e) {
    throw new Error(e);
  }
};

const editCustomer = async (customer_id, { name, email, mobile_no }) => {
  const options = {
    name: name,
    email: email,
    contact: mobile_no,
  };

  try {
    const customer = await razorpay.customers.edit(options);
    return customer;
  } catch (e) {
    throw new Error(e);
  }
};

const getCustomers = async () => {
  try {
    const customers = await razorpay.customers.all();
    return customers;
  } catch (e) {
    throw new Error(e);
  }
};

const getCustomerByID = async customer_id => {
  try {
    const customer = await razorpay.customers.fetch(customer_id);
    return customer;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  createOrder,
  getOrder,
  getPayments,
  getPaymentByID,
  createRefund,
  getRefunds,
  getRefundByID,
  createCustomer,
  editCustomer,
  getCustomers,
  getCustomerByID,
};
