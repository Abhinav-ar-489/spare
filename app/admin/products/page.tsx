import { productService } from "@/services/product-service";
import { ProductListView } from "@/components/admin/product-list-view";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await productService.getAllAdminProducts();

  return <ProductListView initialProducts={products} />;
}
