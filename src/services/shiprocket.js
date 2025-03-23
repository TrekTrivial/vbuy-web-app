const axios = require("axios");
require("dotenv").config();

const email = process.env.SHIPROCKET_EMAIL;
const password = process.env.SHIPROCKET_PASS;
const base_url = "https://apiv2.shiprocket.in/v1/external";

const getAuthTokenSR = async (req, res, next) => {
  let SRtoken = "";
  try {
    if (!SRtoken) {
      const response = await axios.post(`${base_url}/auth/login`, {
        email,
        password,
      });
      SRtoken = response.data.token;
    }
    req.SRtoken = SRtoken;
    next();
  } catch (e) {
    throw new Error(`Hello!!!! ${e}`);
  }
};

const createOrder = async (token, orderDetails) => {
  try {
    const response = await axios.post(
      `${base_url}/orders/create`,
      orderDetails,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response);
    return response.data;
  } catch (e) {
    console.error(
      "Error creating order:",
      e.response ? e.response.data : e.message
    );
    throw new Error(e.response ? JSON.stringify(e.response.data) : e.message);
  }
};

const updatePickupLocation = async (token, order_id, pickup_location) => {
  try {
    const response = await axios.patch(
      `${base_url}/orders/address/pickup`,
      { order_id, pickup_location },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const updateOrder = async (token, orderDetails) => {
  try {
    const response = await axios.post(
      `${base_url}/orders/update/adhoc`,
      orderDetails,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const cancelOrder = async (token, order_id) => {
  try {
    const response = await axios.post(
      `${base_url}/orders/cancel`,
      { ids: order_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const getOrderDetails = async (token, order_id) => {
  try {
    const response = await axios.get(`${base_url}/orders/show/${order_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const generateShipment = async (token, shipment_id) => {
  try {
    const response = await axios.post(
      `${base_url}/courier/assign/web`,
      { shipment_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const generatePickup = async (token, shipment_id) => {
  try {
    const response = await axios.post(
      `${base_url}/courier/generate/pickup`,
      { shipment_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const returnOrder = async (token, orderDetails) => {
  try {
    const response = await axios.post(
      `${base_url}/orders/create/return`,
      orderDetails,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const updateReturn = async (token, orderDetails) => {
  try {
    const response = await axios.post(`${base_url}/orders/edit`, orderDetails, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const generateReturnShipment = async (token, orderDetails) => {
  try {
    const response = await axios.post(
      `${base_url}/courier/assign/awb`,
      orderDetails,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const getShipmentDetails = async (token, shipment_id) => {
  try {
    const response = await axios.get(`${base_url}/shipments/${shipment_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const cancelShipment = async (token, awbs) => {
  try {
    const response = await axios.post(
      `${base_url}/orders/cancel/shipment/awbs`,
      { awbs },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const generateManifest = async (token, shipment_id) => {
  try {
    const response = await axios.post(
      `${base_url}/manifests/generate`,
      { shipment_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const printManifest = async (token, order_id) => {
  try {
    const response = await axios.post(
      `${base_url}/manifests/print`,
      { order_ids: order_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const generateLabel = async (token, shipment_id) => {
  try {
    const response = await axios.post(
      `${base_url}/courier/generate/label`,
      { shipment_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const generateInvoice = async (token, order_id) => {
  try {
    const response = await axios.post(
      `${base_url}/orders/print/invoice`,
      { ids: order_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const getTrackingDetailsAWB = async (token, awb) => {
  try {
    const response = await axios.get(`${base_url}/courier/track/awb/${awb}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

const getTrackingDetailsOrderID = async (token, order_id) => {
  try {
    const response = await axios.get(
      `${base_url}/courier/track?order_id=${order_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getAuthTokenSR,
  createOrder,
  updatePickupLocation,
  updateOrder,
  cancelOrder,
  getOrderDetails,
  generateShipment,
  generatePickup,
  returnOrder,
  updateReturn,
  generateReturnShipment,
  getShipmentDetails,
  cancelShipment,
  generateManifest,
  printManifest,
  generateLabel,
  generateInvoice,
  getTrackingDetailsAWB,
  getTrackingDetailsOrderID,
};
