import {
  Brand,
  Category,
  Enquiry,
  EnquiryStatus,
  Order,
  OrderStatus,
  Product,
  ProductFilterParams,
  Role,
  ShippingAddress,
  SiteSettings,
  UserProfile,
  VehicleMake,
  VehicleModel,
  VehicleVariant,
} from "@/types";
import {
  initialBrands,
  initialCategories,
  initialCompatibility,
  initialMakes,
  initialModels,
  initialProducts,
  initialVariants,
} from "./initial-data";
import { siteConfig } from "../config/site";
import { slugify } from "../utils/formatters";

// In-memory runtime state that persists across requests
class SparePartsDataStore {
  private products: Product[] = [];
  private categories: Category[] = [];
  private brands: Brand[] = [];
  private makes: VehicleMake[] = [];
  private models: VehicleModel[] = [];
  private variants: VehicleVariant[] = [];
  private compatibility: { productId: string; variantId: string; notes?: string }[] = [];
  private enquiries: Enquiry[] = [];
  private settings: SiteSettings = { ...siteConfig };
  private orders: Order[] = [];
  private users: UserProfile[] = [];
  private currentUser: UserProfile | null = null;

  constructor() {
    this.reset();
  }

  public reset() {
    this.categories = JSON.parse(JSON.stringify(initialCategories));
    this.brands = JSON.parse(JSON.stringify(initialBrands));
    this.makes = JSON.parse(JSON.stringify(initialMakes));
    this.models = JSON.parse(JSON.stringify(initialModels));
    this.variants = JSON.parse(JSON.stringify(initialVariants));
    this.compatibility = JSON.parse(JSON.stringify(initialCompatibility));
    this.products = JSON.parse(JSON.stringify(initialProducts));
    this.settings = JSON.parse(JSON.stringify(siteConfig));

    // Seed mock users
    this.users = [
      {
        id: "usr-admin-1",
        email: "admin@apexautospares.com",
        full_name: "Tariq Al-Mansoor (Workshop Manager)",
        phone: "+971 7736523385",
        role: "admin",
        created_at: new Date(Date.now() - 3600000 * 240).toISOString(),
      },
      {
        id: "usr-cust-1",
        email: "customer@apexauto.ae",
        full_name: "Khalid Al-Nuaimi",
        phone: "+971 50 123 4567",
        role: "customer",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];

    // Seed mock enquiries
    this.enquiries = [
      {
        id: "enq-001",
        name: "Rashid Al-Maktoum",
        phone: "+971 50 882 1920",
        email: "rashid.m@emiratesfleet.ae",
        product_id: "prod-brembo-rotor-lc300",
        product_name: "Brembo UV-Coated High-Carbon Ventilated Front Brake Disc",
        product_part_number: "09.C498.11",
        vehicle_details: "Toyota Land Cruiser LC300 (2023, 3.5L Twin-Turbo GR-Sport)",
        message: "Need 4 rotor sets delivered to Al Quoz workshop today. Please confirm stock and 5% VAT invoice.",
        status: "new",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "enq-002",
        name: "Saud Al-Ghamdi",
        phone: "+966 55 412 8899",
        email: "saud@riyadhauto.sa",
        product_id: "prod-bosch-bp-patrol",
        product_name: "Bosch Premium Front Ceramic Heavy-Duty Brake Pad Set",
        product_part_number: "BP-5890",
        vehicle_details: "Nissan Patrol Y62 (2022, 5.6L V8 Titanium)",
        message: "Checking shipping timeframe to Riyadh, KSA. Can you dispatch via DHL Express?",
        status: "contacted",
        created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "enq-003",
        name: "Fahad Al-Kuwari",
        phone: "+974 66 123 456",
        vehicle_details: "Lexus LX600 (2023)",
        message: "Inquiring about Bilstein B6 heavy duty shock absorbers full set for dune driving.",
        status: "resolved",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
    ];

    // Seed mock orders
    this.orders = [
      {
        id: "ord-1001",
        order_number: "APX-98214",
        customer_id: "usr-cust-1",
        customer_name: "Khalid Al-Nuaimi",
        customer_email: "khalid@apexauto.ae",
        customer_phone: "+971 50 123 4567",
        shipping_address: {
          full_name: "Khalid Al-Nuaimi",
          phone: "+971 50 123 4567",
          country: "United Arab Emirates",
          emirate_city: "Dubai",
          street_address: "Al Wasl Road, Villa 42B",
          building_villa: "Villa 42B",
          area_district: "Jumeirah 2",
          notes: "Please call on gate intercom",
        },
        items: [
          {
            product_id: "prod-brembo-rotor-lc300",
            product_name: "Brembo UV-Coated Front Brake Disc",
            part_number: "09.C498.11",
            brand_name: "Brembo",
            unit_price: 460,
            quantity: 2,
            total_price: 920,
            image_url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=200&auto=format&fit=crop&q=80",
          },
          {
            product_id: "prod-mann-air-filter",
            product_name: "Mann-Filter Desert-Grade Air Filter Set",
            part_number: "C 32 028",
            brand_name: "Mann-Filter",
            unit_price: 135,
            quantity: 1,
            total_price: 135,
            image_url: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=200&auto=format&fit=crop&q=80",
          },
        ],
        subtotal: 1055,
        vat_amount: 52.75, // 5% VAT
        shipping_fee: 25,
        total: 1132.75,
        currency: "AED",
        payment_method: "card",
        status: "confirmed",
        created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: "ord-1002",
        order_number: "APX-98215",
        customer_name: "Ahmed Al-Dosari",
        customer_email: "ahmed.d@motorgroup.ae",
        customer_phone: "+971 52 998 1234",
        shipping_address: {
          full_name: "Ahmed Al-Dosari",
          phone: "+971 52 998 1234",
          country: "United Arab Emirates",
          emirate_city: "Abu Dhabi",
          street_address: "Corniche Road, Sector 12",
          area_district: "Al Khalidiya",
        },
        items: [
          {
            product_id: "prod-bosch-bp-patrol",
            product_name: "Bosch Premium Front Ceramic Brake Pad Set",
            part_number: "BP-5890",
            brand_name: "Bosch",
            unit_price: 275,
            quantity: 1,
            total_price: 275,
            image_url: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=200&auto=format&fit=crop&q=80",
          },
        ],
        subtotal: 275,
        vat_amount: 13.75,
        shipping_fee: 30,
        total: 318.75,
        currency: "AED",
        payment_method: "cod",
        status: "pending",
        created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
        updated_at: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
    ];

    this.enrichProducts();
  }

  private enrichProducts() {
    this.products.forEach((p) => {
      p.brand = this.brands.find((b) => b.id === p.brand_id);
      p.category = this.categories.find((c) => c.id === p.category_id);

      const matchedCompats = this.compatibility.filter((c) => c.productId === p.id);
      p.compatibilities = matchedCompats.map((c) => {
        const variant = this.variants.find((v) => v.id === c.variantId);
        if (variant) {
          const model = this.models.find((m) => m.id === variant.model_id);
          if (model) {
            variant.model = {
              ...model,
              make: this.makes.find((mk) => mk.id === model.make_id),
            };
          }
        }
        return {
          id: `comp-${p.id}-${c.variantId}`,
          product_id: p.id,
          variant_id: c.variantId,
          variant,
          notes: c.notes,
        };
      });
    });
  }

  // AUTHENTICATION & USERS
  public authenticateUser(email: string, roleHint?: Role): UserProfile {
    let user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const isManager = email.toLowerCase().includes("admin") || roleHint === "admin";
      user = {
        id: `usr-${Date.now()}`,
        email,
        full_name: isManager ? "Workshop Administrator" : email.split("@")[0],
        role: isManager ? "admin" : "customer",
        created_at: new Date().toISOString(),
      };
      this.users.push(user);
    }
    this.currentUser = user;
    return user;
  }

  public registerUser(name: string, email: string, phone: string, role: Role = "customer"): UserProfile {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.currentUser = existing;
      return existing;
    }
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      full_name: name,
      phone,
      role,
      created_at: new Date().toISOString(),
    };
    this.users.push(newUser);
    this.currentUser = newUser;
    return newUser;
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public logoutUser() {
    this.currentUser = null;
  }

  // ORDERS
  public getOrders(customerId?: string): Order[] {
    let list = [...this.orders];
    if (customerId) {
      list = list.filter((o) => o.customer_id === customerId);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getOrderById(id: string): Order | null {
    return this.orders.find((o) => o.id === id || o.order_number === id) || null;
  }

  public createOrder(data: Omit<Order, "id" | "order_number" | "created_at" | "updated_at">): Order {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...data,
      id: `ord-${Date.now()}`,
      order_number: `APX-${randomSuffix}`,
      status: "confirmed",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(id: string, status: OrderStatus): boolean {
    const ord = this.orders.find((o) => o.id === id || o.order_number === id);
    if (!ord) return false;
    ord.status = status;
    ord.updated_at = new Date().toISOString();
    return true;
  }

  // PRODUCTS
  public getProducts(params: ProductFilterParams = {}): {
    products: Product[];
    total: number;
  } {
    this.enrichProducts();
    let list = this.products.filter((p) => !p.is_archived);

    // Search query: Part Name, Part Number, OEM Number, Brand, Category, Vehicle
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      list = list.filter((p) => {
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesPartNo = p.part_number.toLowerCase().includes(q);
        const matchesOem = p.oem_number?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.name.toLowerCase().includes(q);
        const matchesCategory = p.category?.name.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));

        const matchesVehicle = p.compatibilities?.some((c) => {
          const varName = c.variant?.name.toLowerCase() || "";
          const modelName = c.variant?.model?.name.toLowerCase() || "";
          const makeName = c.variant?.model?.make?.name.toLowerCase() || "";
          return (
            varName.includes(q) ||
            modelName.includes(q) ||
            makeName.includes(q) ||
            `${makeName} ${modelName}`.includes(q)
          );
        });

        return (
          matchesName ||
          matchesPartNo ||
          matchesOem ||
          matchesBrand ||
          matchesCategory ||
          matchesTags ||
          matchesVehicle
        );
      });
    }

    if (params.categoryId) {
      list = list.filter((p) => p.category_id === params.categoryId);
    }

    if (params.brandId) {
      list = list.filter((p) => p.brand_id === params.brandId);
    }

    if (params.variantId) {
      list = list.filter((p) =>
        this.compatibility.some(
          (c) => c.productId === p.id && c.variantId === params.variantId
        )
      );
    } else if (params.modelId) {
      const modelVariants = this.variants.filter((v) => v.model_id === params.modelId).map((v) => v.id);
      list = list.filter((p) =>
        this.compatibility.some(
          (c) => c.productId === p.id && modelVariants.includes(c.variantId)
        )
      );
    } else if (params.makeId) {
      const makeModels = this.models.filter((m) => m.make_id === params.makeId).map((m) => m.id);
      const makeVariants = this.variants.filter((v) => makeModels.includes(v.model_id)).map((v) => v.id);
      list = list.filter((p) =>
        this.compatibility.some(
          (c) => c.productId === p.id && makeVariants.includes(c.variantId)
        )
      );
    }

    if (params.isAvailable !== undefined) {
      list = list.filter((p) => p.is_available === params.isAvailable);
    }

    if (params.isFeatured !== undefined) {
      list = list.filter((p) => p.is_featured === params.isFeatured);
    }

    // Sorting
    if (params.sortBy === "price_low") {
      list.sort((a, b) => (a.discount_price || a.price || 0) - (b.discount_price || b.price || 0));
    } else if (params.sortBy === "price_high") {
      list.sort((a, b) => (b.discount_price || b.price || 0) - (a.discount_price || a.price || 0));
    } else if (params.sortBy === "name_asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sortBy === "name_desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const total = list.length;
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { products: paginated, total };
  }

  public getAllAdminProducts(): Product[] {
    this.enrichProducts();
    return [...this.products].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public getProductBySlug(slug: string): Product | null {
    this.enrichProducts();
    return this.products.find((p) => p.slug === slug && !p.is_archived) || null;
  }

  public getProductById(id: string): Product | null {
    this.enrichProducts();
    return this.products.find((p) => p.id === id) || null;
  }

  public createProduct(data: Partial<Product>): Product {
    const id = `prod-${Date.now()}`;
    const slug = slugify(data.name || "part") + `-${id.slice(-5)}`;
    const newProduct: Product = {
      id,
      name: data.name || "New Automotive Part",
      slug: data.slug || slug,
      part_number: (data.part_number || "").toUpperCase().trim(),
      oem_number: (data.oem_number || "").toUpperCase().trim(),
      brand_id: data.brand_id || this.brands[0]?.id || "brand-bosch",
      category_id: data.category_id || this.categories[0]?.id || "cat-brakes",
      description: data.description || "",
      specifications: data.specifications || {},
      price: data.price !== undefined ? data.price : null,
      discount_price: data.discount_price !== undefined ? data.discount_price : null,
      currency: data.currency || "AED",
      stock: data.stock !== undefined ? data.stock : 10,
      is_available: data.is_available !== undefined ? data.is_available : true,
      is_featured: data.is_featured !== undefined ? data.is_featured : false,
      is_archived: false,
      payment_enabled: true,
      tags: data.tags || [],
      images:
        data.images && data.images.length > 0
          ? data.images
          : [
              {
                id: `img-${Date.now()}`,
                url: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=800&auto=format&fit=crop&q=80",
                alt: data.name || "Part image",
                display_order: 1,
                is_primary: true,
              },
            ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (data.compatibilities && Array.isArray(data.compatibilities)) {
      this.compatibility = this.compatibility.filter((c) => c.productId !== id);
      data.compatibilities.forEach((c) => {
        const variantId = (c as any).variant_id || (c as any).variantId;
        if (variantId) {
          this.compatibility.push({
            productId: id,
            variantId,
            notes: c.notes,
          });
        }
      });
    }

    this.products.unshift(newProduct);
    this.enrichProducts();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    if (updates.compatibilities && Array.isArray(updates.compatibilities)) {
      this.compatibility = this.compatibility.filter((c) => c.productId !== id);
      updates.compatibilities.forEach((c) => {
        const variantId = (c as any).variant_id || (c as any).variantId;
        if (variantId) {
          this.compatibility.push({
            productId: id,
            variantId,
            notes: c.notes,
          });
        }
      });
    }

    const existing = this.products[idx];
    const updated: Product = {
      ...existing,
      ...updates,
      id: existing.id,
      part_number: updates.part_number
        ? updates.part_number.toUpperCase().trim()
        : existing.part_number,
      oem_number: updates.oem_number
        ? updates.oem_number.toUpperCase().trim()
        : existing.oem_number,
      currency: "AED",
      updated_at: new Date().toISOString(),
    };

    this.products[idx] = updated;
    this.enrichProducts();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    this.compatibility = this.compatibility.filter((c) => c.productId !== id);
    return true;
  }

  public archiveProduct(id: string): boolean {
    const p = this.products.find((prod) => prod.id === id);
    if (!p) return false;
    p.is_archived = !p.is_archived;
    p.updated_at = new Date().toISOString();
    return true;
  }

  public toggleAvailability(id: string): boolean {
    const p = this.products.find((prod) => prod.id === id);
    if (!p) return false;
    p.is_available = !p.is_available;
    p.updated_at = new Date().toISOString();
    return true;
  }

  // CATEGORIES & BRANDS
  public getCategories(): Category[] {
    return this.categories.map((c) => ({
      ...c,
      parts_count: this.products.filter((p) => p.category_id === c.id && !p.is_archived).length,
    }));
  }

  public getCategoryBySlug(slug: string): Category | null {
    const c = this.categories.find((cat) => cat.slug === slug);
    if (!c) return null;
    return {
      ...c,
      parts_count: this.products.filter((p) => p.category_id === c.id && !p.is_archived).length,
    };
  }

  public getBrands(): Brand[] {
    return this.brands.map((b) => ({
      ...b,
      parts_count: this.products.filter((p) => p.brand_id === b.id && !p.is_archived).length,
    }));
  }

  public getBrandBySlug(slug: string): Brand | null {
    const b = this.brands.find((br) => br.slug === slug);
    if (!b) return null;
    return {
      ...b,
      parts_count: this.products.filter((p) => p.brand_id === b.id && !p.is_archived).length,
    };
  }

  public createBrand(data: {
    name: string;
    slug?: string;
    logo_url?: string;
    description?: string;
  }): Brand {
    const slug = data.slug?.trim() || slugify(data.name);
    const newBrand: Brand = {
      id: `brand-${slug}-${Date.now()}`,
      name: data.name.trim(),
      slug,
      logo_url:
        data.logo_url?.trim() ||
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&auto=format&fit=crop&q=80",
      description:
        data.description?.trim() ||
        `Authorized OEM and precision aftermarket components manufactured by ${data.name.trim()}.`,
      parts_count: 0,
    };
    this.brands.push(newBrand);
    return newBrand;
  }

  // VEHICLES
  public getVehicleMakes(): VehicleMake[] {
    return this.makes;
  }

  public getVehicleModels(makeId?: string): VehicleModel[] {
    let list = this.models;
    if (makeId) list = list.filter((m) => m.make_id === makeId);
    return list.map((m) => ({
      ...m,
      make: this.makes.find((mk) => mk.id === m.make_id),
    }));
  }

  public getVehicleVariants(modelId?: string): VehicleVariant[] {
    let list = this.variants;
    if (modelId) list = list.filter((v) => v.model_id === modelId);
    return list.map((v) => ({
      ...v,
      model: this.models.find((m) => m.id === v.model_id),
    }));
  }

  public createVehicleMake(data: {
    name: string;
    slug?: string;
    logo_url?: string;
  }): VehicleMake {
    const slug = data.slug?.trim() || slugify(data.name);
    const newMake: VehicleMake = {
      id: `make-${slug}-${Date.now()}`,
      name: data.name.trim(),
      slug,
      logo_url:
        data.logo_url?.trim() ||
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80",
    };
    this.makes.push(newMake);
    return newMake;
  }

  public createVehicleModel(data: {
    make_id: string;
    name: string;
    slug?: string;
    year_start: number;
    year_end?: number | null;
  }): VehicleModel {
    const slug = data.slug?.trim() || slugify(data.name);
    const newModel: VehicleModel = {
      id: `model-${slug}-${Date.now()}`,
      make_id: data.make_id,
      name: data.name.trim(),
      slug,
      year_start: Number(data.year_start),
      year_end: data.year_end !== undefined && data.year_end !== null ? Number(data.year_end) : null,
    };
    this.models.push(newModel);
    return newModel;
  }

  public createVehicleVariant(data: {
    model_id: string;
    name: string;
    fuel_type?: "Petrol" | "Diesel" | "Hybrid" | "Electric" | "CNG";
    engine_capacity?: string;
    transmission?: "Manual" | "Automatic" | "CVT" | "DCT";
  }): VehicleVariant {
    const newVariant: VehicleVariant = {
      id: `var-${slugify(data.name)}-${Date.now()}`,
      model_id: data.model_id,
      name: data.name.trim(),
      fuel_type: data.fuel_type || "Petrol",
      engine_capacity: data.engine_capacity?.trim() || "3.5L V6",
      transmission: data.transmission || "Automatic",
    };
    this.variants.push(newVariant);
    return newVariant;
  }

  public createCompleteVehicle(data: {
    makeId?: string;
    makeName?: string;
    modelId?: string;
    modelName?: string;
    yearStart?: number;
    yearEnd?: number | null;
    variantName: string;
    fuelType?: "Petrol" | "Diesel" | "Hybrid" | "Electric" | "CNG";
    engineCapacity?: string;
    transmission?: "Manual" | "Automatic" | "CVT" | "DCT";
  }): { make: VehicleMake; model: VehicleModel; variant: VehicleVariant } {
    let make: VehicleMake;
    if (data.makeId) {
      const existing = this.makes.find((m) => m.id === data.makeId);
      if (!existing) throw new Error("Make not found");
      make = existing;
    } else if (data.makeName) {
      const existing = this.makes.find(
        (m) => m.name.toLowerCase() === data.makeName!.trim().toLowerCase()
      );
      make = existing || this.createVehicleMake({ name: data.makeName });
    } else {
      throw new Error("Vehicle Make is required");
    }

    let model: VehicleModel;
    if (data.modelId) {
      const existing = this.models.find((m) => m.id === data.modelId);
      if (!existing) throw new Error("Model not found");
      model = existing;
    } else if (data.modelName) {
      const existing = this.models.find(
        (m) => m.make_id === make.id && m.name.toLowerCase() === data.modelName!.trim().toLowerCase()
      );
      model =
        existing ||
        this.createVehicleModel({
          make_id: make.id,
          name: data.modelName,
          year_start: data.yearStart || 2020,
          year_end: data.yearEnd !== undefined ? data.yearEnd : null,
        });
    } else {
      throw new Error("Vehicle Model is required");
    }

    const variant = this.createVehicleVariant({
      model_id: model.id,
      name: data.variantName,
      fuel_type: data.fuelType,
      engine_capacity: data.engineCapacity,
      transmission: data.transmission,
    });

    return { make, model, variant };
  }

  // ENQUIRIES
  public getEnquiries(): Enquiry[] {
    return [...this.enquiries].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  public createEnquiry(data: Partial<Enquiry>): Enquiry {
    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      name: data.name || "Customer",
      phone: data.phone || "",
      email: data.email || "",
      product_id: data.product_id,
      product_name: data.product_name,
      product_part_number: data.product_part_number,
      vehicle_details: data.vehicle_details,
      message: data.message || "",
      status: "new",
      created_at: new Date().toISOString(),
    };
    this.enquiries.unshift(newEnquiry);
    return newEnquiry;
  }

  public updateEnquiryStatus(id: string, status: EnquiryStatus): boolean {
    const enq = this.enquiries.find((e) => e.id === id);
    if (!enq) return false;
    enq.status = status;
    return true;
  }

  // SETTINGS
  public getSettings(): SiteSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    this.settings = {
      ...this.settings,
      ...updates,
      social_links: {
        ...this.settings.social_links,
        ...(updates.social_links || {}),
      },
    };
    return this.getSettings();
  }

  // ANALYTICS / STATS
  public getStats() {
    const activeProducts = this.products.filter((p) => !p.is_archived && p.is_available).length;
    const outOfStock = this.products.filter((p) => !p.is_archived && (!p.is_available || p.stock === 0)).length;
    const totalEnquiries = this.enquiries.length;
    const newEnquiries = this.enquiries.filter((e) => e.status === "new").length;
    const totalOrders = this.orders.length;
    const pendingOrders = this.orders.filter((o) => o.status === "pending" || o.status === "confirmed").length;

    return {
      totalProducts: this.products.length,
      activeProducts,
      outOfStock,
      totalCategories: this.categories.length,
      totalBrands: this.brands.length,
      totalEnquiries,
      newEnquiries,
      totalOrders,
      pendingOrders,
    };
  }
}

// Global singleton instance
const globalForStore = global as unknown as { spareDataStore: SparePartsDataStore };

export const store = globalForStore.spareDataStore || new SparePartsDataStore();

if (process.env.NODE_ENV !== "production") {
  globalForStore.spareDataStore = store;
}
