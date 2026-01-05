import axios from "axios";

// AUTH: Register a new user
export const registerUser = async (userData) => {
  // Expects: { name, email, password, role }
  return await api.post("/auth/register", userData);
};

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Automatically add the Token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getRestaurantMenu = async (restaurantId) => {
  return await api.get(`/api/food/${restaurantId}`);
};

// Place a new order
export const createOrder = async (orderData) => {
  return await api.post("/api/orders", orderData);
};

// Get my order history
export const getMyOrders = async () => {
  return await api.get("/api/orders");
};

// ADMIN: Create a Restaurant
export const createRestaurant = async (data) => {
  return await api.post("/api/restaurants", data);
};

// ADMIN: Add Food to a Restaurant
export const addFoodItem = async (restaurantId, data) => {
  return await api.post(`/api/food/${restaurantId}`, data);
};

// ADMIN: Update Order Status
export const updateOrderStatus = async (orderId, status) => {
  return await api.post(`/api/orders/${orderId}/status`, null, {
        params: { status: status }
    });
};

// ADMIN: Get All Orders (Reusing the existing one, assuming Admin sees all)
export const getAllOrders = async () => {
  const response = await api.get("/api/orders/admin/all"); 
  return response;
};
export default api;
