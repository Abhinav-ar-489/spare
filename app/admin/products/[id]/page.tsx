import { notFound } from "next/navigation";
import { productService } from "@/services/product-service";
import { categoryService, brandService, vehicleService } from "@/services";
import { ProductForm } from "@/components/admin/product-form";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await productService.getProductById(id);

  if (!product) {
    notFound();
  }

  const [categories, brands, makes, models, variants] = await Promise.all([
    categoryService.getCategories(),
    brandService.getBrands(),
    vehicleService.getMakes(),
    vehicleService.getModels(),
    vehicleService.getVariants(),
  ]);

  return (
    <ProductForm
      initialProduct={product}
      categories={categories}
      brands={brands}
      makes={makes}
      models={models}
      variants={variants}
      isEdit={true}
    />
  );
}
