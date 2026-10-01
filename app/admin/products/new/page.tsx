import { categoryService, brandService, vehicleService } from "@/services";
import { ProductForm } from "@/components/admin/product-form";

export const revalidate = 0;

export default async function NewProductPage() {
  const [categories, brands, makes, models, variants] = await Promise.all([
    categoryService.getCategories(),
    brandService.getBrands(),
    vehicleService.getMakes(),
    vehicleService.getModels(),
    vehicleService.getVariants(),
  ]);

  return (
    <ProductForm
      categories={categories}
      brands={brands}
      makes={makes}
      models={models}
      variants={variants}
      isEdit={false}
    />
  );
}
