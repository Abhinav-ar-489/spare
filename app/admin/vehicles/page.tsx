import { vehicleService } from "@/services";
import { VehiclesManager } from "@/components/admin/vehicles-manager";

export const revalidate = 0;

export default async function AdminVehiclesPage() {
  const [makes, models, variants] = await Promise.all([
    vehicleService.getMakes(),
    vehicleService.getModels(),
    vehicleService.getVariants(),
  ]);

  return (
    <VehiclesManager
      initialMakes={makes}
      initialModels={models}
      initialVariants={variants}
    />
  );
}
