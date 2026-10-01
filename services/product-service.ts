import { store } from "@/lib/data/store";
import { Product, ProductFilterParams } from "@/types";

export const productService = {
  async getProducts(params: ProductFilterParams = {}) {
    return store.getProducts(params);
  },

  async getAllAdminProducts() {
    return store.getAllAdminProducts();
  },

  async getFeaturedProducts(limit: number = 8) {
    const res = store.getProducts({ isFeatured: true, limit });
    return res.products;
  },

  async getProductBySlug(slug: string) {
    return store.getProductBySlug(slug);
  },

  async getProductById(id: string) {
    return store.getProductById(id);
  },

  async createProduct(data: Partial<Product>) {
    return store.createProduct(data);
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    return store.updateProduct(id, updates);
  },

  async deleteProduct(id: string) {
    return store.deleteProduct(id);
  },

  async archiveProduct(id: string) {
    return store.archiveProduct(id);
  },

  async toggleAvailability(id: string) {
    return store.toggleAvailability(id);
  },

  async getRelatedProducts(productId: string, categoryId: string, limit: number = 4) {
    const { products } = store.getProducts({ categoryId, limit: limit + 1 });
    return products.filter((p) => p.id !== productId).slice(0, limit);
  },
};
