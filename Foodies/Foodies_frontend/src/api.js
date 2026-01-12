import axios from "axios";

// If running locally (npm run dev), use localhost:8080.
// If running in Docker (production), use relative path so Nginx handles it.
const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:8080" 
  : ""; 

const api = axios.create({
  baseURL: BASE_URL,
});

// Automatically add the Token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ... keep the rest of your exports exactly the same ...
export const toggleRestaurantStatus = async (restaurantId) => {
  return await api.put(`/api/restaurants/${restaurantId}/status`);
};
// (Paste the rest of your existing functions here)
export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData);
};
export const getRestaurantMenu = async (restaurantId) => {
  return await api.get(`/api/food/${restaurantId}`);
};
export const createOrder = async (orderData) => {
  return await api.post("/api/orders", orderData);
};
export const getMyOrders = async () => {
  return await api.get("/api/orders");
};
export const createRestaurant = async (data) => {
  return await api.post("/api/restaurants", data);
};
export const addFoodItem = async (restaurantId, data) => {
  return await api.post(`/api/food/${restaurantId}`, data);
};
export const updateOrderStatus = async (orderId, status) => {
  return await api.post(`/api/orders/${orderId}/status`, null, {
    params: { status: status },
  });
};
export const getAllOrders = async () => {
  const response = await api.get("/api/orders/admin/all");
  return response;
};
export const deleteFoodItem = async (foodId) => {
  return await api.delete(`/api/food/${foodId}`);
};
export const toggleFoodAvailability = async (foodId) => {
  return await api.put(`/api/food/${foodId}/availability`);
};
export const getUserProfile = async () => api.get("/api/users/profile");
export const updateUserProfile = async (data) => api.put("/api/users/profile", data);
export const addReview = async (restaurantId, data) => api.post(`/api/reviews/${restaurantId}`, data);
export const getReviews = async (restaurantId) => api.get(`/api/reviews/${restaurantId}`);

export default api;