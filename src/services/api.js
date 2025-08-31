import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8002";

const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	},
);

const API = {
	login: (email, password) =>
		axiosInstance.post("/users/admin/login", { email, password }),
	getMe: () => axiosInstance.get("/users/me"),
	getAllProducts: (params) => axiosInstance.get("/products", { params }),
	getProduct: (id) => axiosInstance.get(`/products/${id}`),
	createProduct: (productData) =>
		axiosInstance.post("/products", productData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	updateProduct: (id, productData) =>
		axiosInstance.put(`/products/${id}`, productData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	deleteCategoryImage: (id) => axiosInstance.delete(`/categories/${id}/image`),
	deleteProduct: (id) => axiosInstance.delete(`/products/${id}`),
	setFeaturedImage: (productId, imageId) =>
		axiosInstance.put(`/products/${productId}/featured-image`, { imageId }),
	deleteProductImage: (productId, imageId) =>
		axiosInstance.delete(`/products/${productId}/images/${imageId}`),
	uploadEditorImage: (imageData) =>
		axiosInstance.post("/editor-uploads", imageData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	getAllCategories: () => axiosInstance.get("/categories/admin"),
	getCategory: (id) => axiosInstance.get(`/categories/${id}`),
	createCategory: (categoryData) =>
		axiosInstance.post("/categories", categoryData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	updateCategory: (id, categoryData) =>
		axiosInstance.put(`/categories/${id}`, categoryData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),
	getAllOrdersAdmin: (params) => axiosInstance.get("/orders/admin/all", { params }),
	getOrderAdmin: (id) => axiosInstance.get(`/orders/admin/${id}`),
	updateOrderStatusAdmin: (id, status) =>
		axiosInstance.put(`/orders/${id}/status`, { status }),
	createOrder: (orderData) => axiosInstance.post("/orders", orderData),

	// Users
	getUsers: () => axiosInstance.get("/users"),
	getUser: (id) => axiosInstance.get(`/users/${id}`),
	updateUser: (id, data) => axiosInstance.put(`/users/${id}`, data),

	// Stats
	getDashboardStats: () => axiosInstance.get("/stats"),

	// Settings
	getSettings: () => axiosInstance.get("/settings"),
	updateSettings: (data) =>
		axiosInstance.put("/settings", data, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	
	// Contacts
	getContacts: () => axiosInstance.get("/contacts"),
	updateContact: (id, data) => axiosInstance.put(`/contacts/${id}`, data),
	deleteContact: (id) => axiosInstance.delete(`/contacts/${id}`),
};

export default API;
