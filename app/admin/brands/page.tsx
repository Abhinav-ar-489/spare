import { brandService } from "@/services";
import { BrandsManager } from "@/components/admin/brands-manager";

export const revalidate = 0;

export default async function AdminBrandsPage() {
  const brands = await brandService.getBrands();

  return <BrandsManager initialBrands={brands} />;
}
