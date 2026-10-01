import { store } from "@/lib/data/store";
import { Order, OrderStatus, Role } from "@/types";

export const categoryService = {
  async getCategories() {
    return store.getCategories();
  },

  async getCategoryBySlug(slug: string) {
    return store.getCategoryBySlug(slug);
  },
};

export const brandService = {
  async getBrands() {
    return store.getBrands();
  },

  async getBrandBySlug(slug: string) {
    return store.getBrandBySlug(slug);
  },

  async createBrand(data: Parameters<typeof store.createBrand>[0]) {
    return store.createBrand(data);
  },
};

export const vehicleService = {
  async getMakes() {
    return store.getVehicleMakes();
  },

  async getModels(makeId?: string) {
    return store.getVehicleModels(makeId);
  },

  async getVariants(modelId?: string) {
    return store.getVehicleVariants(modelId);
  },

  async createMake(data: Parameters<typeof store.createVehicleMake>[0]) {
    return store.createVehicleMake(data);
  },

  async createModel(data: Parameters<typeof store.createVehicleModel>[0]) {
    return store.createVehicleModel(data);
  },

  async createVariant(data: Parameters<typeof store.createVehicleVariant>[0]) {
    return store.createVehicleVariant(data);
  },

  async createCompleteVehicle(data: Parameters<typeof store.createCompleteVehicle>[0]) {
    return store.createCompleteVehicle(data);
  },
};

export const enquiryService = {
  async getEnquiries() {
    return store.getEnquiries();
  },

  async createEnquiry(data: Parameters<typeof store.createEnquiry>[0]) {
    return store.createEnquiry(data);
  },

  async updateStatus(id: string, status: Parameters<typeof store.updateEnquiryStatus>[1]) {
    return store.updateEnquiryStatus(id, status);
  },
};

export const orderService = {
  async getOrders(customerId?: string) {
    return store.getOrders(customerId);
  },

  async getOrderById(id: string) {
    return store.getOrderById(id);
  },

  async createOrder(data: Parameters<typeof store.createOrder>[0]) {
    return store.createOrder(data);
  },

  async updateStatus(id: string, status: OrderStatus) {
    return store.updateOrderStatus(id, status);
  },
};

export const authService = {
  async login(email: string, roleHint?: Role) {
    return store.authenticateUser(email, roleHint);
  },

  async register(name: string, email: string, phone: string, role: Role = "customer") {
    return store.registerUser(name, email, phone, role);
  },

  async getCurrentUser() {
    return store.getCurrentUser();
  },

  async logout() {
    return store.logoutUser();
  },
};

export const settingsService = {
  async getSettings() {
    return store.getSettings();
  },

  async updateSettings(data: Parameters<typeof store.updateSettings>[0]) {
    return store.updateSettings(data);
  },

  async getStats() {
    return store.getStats();
  },
};
