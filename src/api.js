import axios from 'axios';
import { getConfig } from './config.js';

const BASE_URL = 'https://app.billbee.io';

function getClient() {
  const username = getConfig('username');
  const apiKey = getConfig('apiKey');
  const apiPassword = getConfig('apiPassword') || '';
  return axios.create({
    baseURL: BASE_URL,
    auth: { username, password: apiKey },
    headers: {
      'X-Billbee-Api-Key': apiKey,
      'Content-Type': 'application/json'
    }
  });
}

// Orders
export async function listOrders(params = {}) {
  const client = getClient();
  const res = await client.get('/api/v1/orders', { params });
  return res.data;
}

export async function getOrder(orderId) {
  const client = getClient();
  const res = await client.get(`/api/v1/orders/${orderId}`);
  return res.data;
}

export async function patchOrder(orderId, model) {
  const client = getClient();
  const res = await client.patch(`/api/v1/orders/${orderId}`, model);
  return res.data;
}

export async function createShipment(orderId, options) {
  const client = getClient();
  const res = await client.post(`/api/v1/orders/${orderId}/shipment`, options);
  return res.data;
}

// Products
export async function listProducts(params = {}) {
  const client = getClient();
  const res = await client.get('/api/v1/products', { params });
  return res.data;
}

export async function getProduct(productId) {
  const client = getClient();
  const res = await client.get(`/api/v1/products/${productId}`);
  return res.data;
}

export async function createProduct(product) {
  const client = getClient();
  const res = await client.post('/api/v1/products', product);
  return res.data;
}

export async function updateProduct(productId, product) {
  const client = getClient();
  const res = await client.put(`/api/v1/products/${productId}`, product);
  return res.data;
}

// Customers
export async function listCustomers(params = {}) {
  const client = getClient();
  const res = await client.get('/api/v1/customers', { params });
  return res.data;
}

export async function getCustomer(customerId) {
  const client = getClient();
  const res = await client.get(`/api/v1/customers/${customerId}`);
  return res.data;
}

export async function getCustomerOrders(customerId) {
  const client = getClient();
  const res = await client.get(`/api/v1/customers/${customerId}/orders`);
  return res.data;
}

// Customer Addresses
export async function listCustomerAddresses(params = {}) {
  const client = getClient();
  const res = await client.get('/api/v1/customer-addresses', { params });
  return res.data;
}

// Enums
export async function getOrderStates() {
  const client = getClient();
  const res = await client.get('/api/v1/enums/orderstates');
  return res.data;
}

export async function getPaymentTypes() {
  const client = getClient();
  const res = await client.get('/api/v1/enums/paymenttypes');
  return res.data;
}

export async function getShipmentTypes() {
  const client = getClient();
  const res = await client.get('/api/v1/enums/shipmenttypes');
  return res.data;
}

export async function getShippingCarriers() {
  const client = getClient();
  const res = await client.get('/api/v1/enums/shippingcarriers');
  return res.data;
}

// Events
export async function listEvents(params = {}) {
  const client = getClient();
  const res = await client.get('/api/v1/events', { params });
  return res.data;
}

// Webhooks
export async function listWebhooks() {
  const client = getClient();
  const res = await client.get('/api/v1/webhooks');
  return res.data;
}
