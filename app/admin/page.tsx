import { settingsService } from "@/services";
import { productService } from "@/services/product-service";
import { enquiryService } from "@/services";
import { DashboardView } from "@/components/admin/dashboard-view";

export const revalidate = 0; // Dynamic admin data

export default async function AdminDashboardPage() {
  const [stats, productsResult, enquiries] = await Promise.all([
    settingsService.getStats(),
    productService.getProducts({ limit: 10 }),
    enquiryService.getEnquiries(),
  ]);

  return (
    <DashboardView
      stats={stats}
      recentProducts={productsResult.products}
      recentEnquiries={enquiries}
    />
  );
}
